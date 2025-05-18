"use server";
import { db } from "@/db";
import { authors } from "@/db/schema";
import { canWrite } from "@/lib/permissions";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function editAuthor({
  gameId,
  userId,
  role,
}: {
  gameId: string;
  userId: number;
  role?: string;
}) {
  if (!(await canWrite(gameId))) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db
      .update(authors)
      .set({ role })
      .where(and(eq(authors.userId, userId), eq(authors.gameId, gameId)));
  } catch (error) {
    console.error("Error updating author role:", error);
    // TODO Handle the error as needed (e.g., log it, throw an error, etc.)
    return { success: false, error: "Failed to update role" };
  }

  revalidatePath(`/game/${gameId}`);
  return { success: true };
}
