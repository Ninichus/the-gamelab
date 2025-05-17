"use server";
import { getUser } from "@/lib/session";
import { canWrite } from "@/lib/permissions";
import { uploadFile } from "@/lib/client-s3";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { files } from "@/db/schema";
import { customAlphabet } from "nanoid";
import { NextRequest } from "next/server";

const nanoid = customAlphabet("1234567890abcdef");

const maxFileSize = {
  carousel_image: 10 * 1024 * 1024, // 10MB
  browse_image: 10 * 1024 * 1024, // 10MB
  game_archive: 2 * 1024 * 1024 * 1024, // 2GB
};
const allowedFileTypes = {
  carousel_image: ["image/*", "video/*"],
  browse_image: ["image/*", "video/*"],
  game_archive: [],
};
//TODO : restrict type for game_archive ?

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const gameId = (await params).id;
  const type = request?.nextUrl?.searchParams.get("type") as
    | "carousel_image"
    | "browse_image"
    | "game_archive";
  const index = parseInt(request?.nextUrl?.searchParams.get("index") ?? "0");
  const user = await getUser();
  if (!user) {
    throw new Error("Middleware failure");
  }

  if (!(await canWrite(gameId))) {
    return Response.json(
      { success: false, error: "Unauthorized" },
      { status: 403 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return Response.json({ success: false, error: "No file" }, { status: 400 });
  }
  if (file.size == 0) {
    return Response.json(
      { success: false, error: "Empty file" },
      { status: 400 }
    );
  }
  if (file.size > maxFileSize[type]) {
    return Response.json(
      { success: false, error: "File too large" },
      { status: 400 }
    );
  }
  if (
    !(
      allowedFileTypes[type].some((t) => file.type.match(t)) ||
      type === "game_archive"
    )
  ) {
    return Response.json(
      { success: false, error: "Invalid file type" },
      { status: 400 }
    );
  }

  try {
    await db.transaction(async (tx) => {
      const fileId = nanoid(40);
      await tx.insert(files).values({
        id: fileId,
        name: file.name,
        type,
        index,
        gameId,
        userId: user.id,
      });

      try {
        await uploadFile(fileId, file);
      } catch (e) {
        console.error("Error uploading file to S3", e);
        tx.rollback();
      }
    });
  } catch (error) {
    console.error("Error uploading file", error);
    return Response.json(
      {
        success: false,
        error: "Error uploading file",
      },
      { status: 500 }
    );
  }

  revalidatePath(`/game/${gameId}`);
  return Response.json({ success: true });
}
