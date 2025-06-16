"use server";
import { db } from "@/db";
import { eq, and, inArray } from "drizzle-orm";
import { files as filesTable } from "@/db/schema";
import { canWrite } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function moveSlide({
  gameId,
  slideIndex,
  delta,
}: {
  gameId: string;
  slideIndex: number;
  delta: -1 | 1;
}) {
  if (!(await canWrite(gameId))) {
    return { success: false, error: "Unauthorized" };
  }

  const files = await db
    .select({ id: filesTable.id, index: filesTable.index })
    .from(filesTable)
    .where(eq(filesTable.gameId, gameId));

  const maxIndex = files.reduce((max, file) => {
    return Math.max(max, file.index ?? 0);
  }, 0);

  if (delta + slideIndex < 0 || delta + slideIndex > maxIndex) {
    return { success: false, error: "Invalid slide index" };
  }

  const currentFiles = files.filter((file) => file.index === slideIndex);
  const targetFiles = files.filter((file) => file.index === slideIndex + delta);

  if (!currentFiles || !targetFiles) {
    return { success: false, error: "Slide not found" };
  }

  // Swap the indexes
  await db.transaction(async (tx) => {
    await tx
      .update(filesTable)
      .set({ index: targetFiles[0].index })
      .where(
        and(
          inArray(
            filesTable.id,
            currentFiles.map((file) => file.id)
          ),
          eq(filesTable.gameId, gameId)
        )
      );

    await tx
      .update(filesTable)
      .set({ index: currentFiles[0].index })
      .where(
        and(
          inArray(
            filesTable.id,
            targetFiles.map((file) => file.id)
          ),
          eq(filesTable.gameId, gameId)
        )
      );
  });

  revalidatePath(`/game/${gameId}`);
  return { success: true };
}
