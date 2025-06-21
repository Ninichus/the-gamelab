"use server";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { authors } from "@/db/schema";
import { canWrite } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function removeAuthor({
  gameId,
  userId,
}: {
  gameId: string;
  userId: number;
}) {
  if (!(await canWrite(gameId))) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db
      .delete(authors)
      .where(and(eq(authors.gameId, gameId), eq(authors.userId, userId)));
  } catch (error) {
    console.error("Error deleting author:", error);
    return { success: false, error: "Failed to remove author" };
  }

  revalidatePath(`/game/${gameId}`);
  return { success: true };
}
