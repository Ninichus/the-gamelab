"use server";
import { db } from "@/db";
import { eq, and, sql, gt } from "drizzle-orm";
import { files as filesTable } from "@/db/schema";
import { canWrite } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { deleteFile as deleteFileFromS3 } from "@/lib/client-s3";

export async function deleteSlide({
  gameId,
  slideIndex,
}: {
  gameId: string;
  slideIndex: number;
}) {
  if (!(await canWrite(gameId))) {
    return { success: false, error: "Unauthorized" };
  }

  const files = await db
    .select({ id: filesTable.id, type: filesTable.type })
    .from(filesTable)
    .where(
      and(eq(filesTable.gameId, gameId), eq(filesTable.index, slideIndex))
    );

  if (!files) {
    return { success: false, error: "Invalid slide index" };
  }

  try {
    await db.transaction(async (tx) => {
      // First delete the real media
      files
        .filter((file) => file.type !== "carousel_video_thumbnail")
        .forEach(async (file) => {
          const fileId = file.id;
          if (!fileId) {
            throw new Error("File ID is missing");
          }
          try {
            await deleteFileFromS3(fileId);
            await tx.delete(filesTable).where(eq(filesTable.id, fileId));
          } catch (e) {
            console.error("Error deleting file from S3", e);
            tx.rollback();
            throw new Error("Error deleting file");
          }
        });

      // Then delete thumbnail if it exists
      files
        .filter((file) => file.type === "carousel_video_thumbnail")
        .forEach(async (file) => {
          const fileId = file.id;
          if (!fileId) {
            throw new Error("File ID is missing");
          }
          try {
            await deleteFileFromS3(fileId);
            await tx.delete(filesTable).where(eq(filesTable.id, fileId));
          } catch (e) {
            console.error("Error deleting file from S3", e);
            tx.rollback();
            throw new Error("Error deleting file");
          }
        });
    });
  } catch (error) {
    console.error("Error deleting file", error);
    return { success: false, error: "Error deleting file" };
  }

  await db
    .update(filesTable)
    .set({ index: sql`${filesTable.index} - 1` })
    .where(
      and(eq(filesTable.gameId, gameId), gt(filesTable.index, slideIndex))
    );

  revalidatePath(`/game/${gameId}`);
  return { success: true };
}
