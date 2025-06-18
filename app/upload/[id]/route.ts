import { getUser } from "@/lib/session";
import { canWrite } from "@/lib/permissions";
import { deleteFile, uploadFile } from "@/lib/client-s3";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { files } from "@/db/schema";
import { customAlphabet } from "nanoid";
import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { extractThumbnail } from "@/lib/actions/extract-thumbnail";

export const dynamic = "force-dynamic";

const nanoid = customAlphabet("1234567890abcdef");

const maxFileSize = {
  carousel_file: 100 * 1024 * 1024, // 100MB
  browse_image: 10 * 1024 * 1024, // 10MB
  game_archive: 2 * 1024 * 1024 * 1024, // 2GB
};
const allowedFileTypes = {
  carousel_file: ["image/*", "video/*"],
  browse_image: ["image/*"], //For now, only images
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
    | "carousel_file"
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

  if (type === "browse_image") {
    await db.transaction(async (tx) => {
      // Check if a browse image already exists
      const [existingBrowseImage] = await tx
        .select()
        .from(files)
        .where(and(eq(files.gameId, gameId), eq(files.type, "browse_image")))
        .limit(1);

      if (existingBrowseImage) {
        // Delete the existing browse image
        try {
          await deleteFile(existingBrowseImage.id); // This will delete the file from S3
          await tx.delete(files).where(eq(files.id, existingBrowseImage.id));
        } catch (e) {
          console.error("Error deleting existing browse image", e);
          tx.rollback();
          return Response.json(
            { success: false, error: "Error deleting existing browse image" },
            { status: 500 }
          );
        }
      }
    });
  }

  try {
    await db.transaction(async (tx) => {
      const fileId = nanoid(40);

      if (type === "carousel_file" && file.type.match("video/*")) {
        await tx.insert(files).values({
          id: `${fileId.slice(0, -2)}_t`,
          name: `${file.name}-thumbnail`,
          type: "carousel_video_thumbnail",
          index,
          gameId,
          userId: user.id,
        });

        try {
          const thumbnail = await extractThumbnail(
            file,
            `${fileId.slice(0, -2)}_t`
          );
          await uploadFile(`${fileId.slice(0, -2)}_t`, thumbnail);
        } catch (e) {
          console.error("Error uploading thumbnail to S3", e);
          tx.rollback();
          return Response.json(
            { success: false, error: "Error uploading thumbnail" },
            { status: 500 }
          );
        }
      }

      await tx.insert(files).values({
        id: fileId,
        name: file.name,
        type:
          type === "carousel_file"
            ? file.type.match("image/*")
              ? "carousel_image"
              : "carousel_video"
            : type,
        index,
        gameId,
        userId: user.id,
        associatedThumbnail:
          type === "carousel_file" && file.type.match("video/*")
            ? `${fileId.slice(0, -2)}_t`
            : null,
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
