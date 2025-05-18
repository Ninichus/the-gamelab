"use server";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { tags } from "@/db/schema";
import { canWrite } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function removeTag({
  gameId,
  tagId,
}: {
  gameId: string;
  tagId: number;
}) {
  if (!(await canWrite(gameId))) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db
      .delete(tags)
      .where(and(eq(tags.gameId, gameId), eq(tags.id, tagId)));
  } catch (error) {
    console.error("Error deleting tag:", error);
    // TODO Handle the error as needed (e.g., log it, throw an error, etc.)
    return { success: false, error: "Failed to remove tag" };
  }

  revalidatePath(`/game/${gameId}`);
  return { success: true };
}
