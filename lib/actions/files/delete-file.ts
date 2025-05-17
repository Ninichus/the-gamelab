"use server";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { files } from "@/db/schema";
import { canWrite } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { deleteFile as deleteFileFromS3 } from "@/lib/client-s3";

export async function deleteFile({
  gameId,
  fileId,
}: {
  gameId: string;
  fileId: string;
}) {
  if (!(await canWrite(gameId))) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db.transaction(async (tx) => {
      await tx.delete(files).where(eq(files.id, fileId));

      try {
        await deleteFileFromS3(fileId);
      } catch (e) {
        console.error("Error deleting file from S3", e);
        tx.rollback();
      }
    });
  } catch (error) {
    console.error("Error deleting file", error);
    return Response.json(
      {
        success: false,
        error: "Error deleting file",
      },
      { status: 500 }
    );
  }

  revalidatePath(`/game/${gameId}`);
  return { success: true };
}
