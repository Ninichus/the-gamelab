"use server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { games, files as filesTable } from "@/db/schema";
import { canWrite } from "@/lib/permissions";
import { deleteFile as deleteFileFromS3 } from "../client-s3";
import { revalidatePath } from "next/cache";

export async function deleteGame(gameId: string) {
  const [game] = await db
    .select()
    .from(games)
    .where(eq(games.id, gameId))
    .limit(1);
  if (!game) {
    return { success: false, error: "Invalid Game ID" };
  }

  if (!(await canWrite(gameId))) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db.transaction(async (tx) => {
      const files = await tx
        .select()
        .from(filesTable)
        .where(eq(filesTable.gameId, gameId));

      //First delete thumbnails
      await Promise.all(
        files
          .filter((file) => file.type === "carousel_video_thumbnail")
          .map(async (file) => {
            try {
              await deleteFileFromS3(file.id);
              await tx.delete(filesTable).where(eq(filesTable.id, file.id));
            } catch (e) {
              console.error("Error deleting file from S3", e);
              tx.rollback();
            }
          })
      );

      //Then delete other files
      await Promise.all(
        files
          .filter((file) => file.type !== "carousel_video_thumbnail")
          .map(async (file) => {
            try {
              await deleteFileFromS3(file.id);
              await tx.delete(filesTable).where(eq(filesTable.id, file.id));
            } catch (e) {
              console.error("Error deleting file from S3", e);
              tx.rollback();
            }
          })
      );
      await tx.delete(games).where(eq(games.id, gameId));
    });
  } catch (error) {
    console.error("Error deleting game", error);
    return { success: false, error: "Error deleting game" };
  }

  revalidatePath(`/game/${gameId}`);
  return { success: true };
}
