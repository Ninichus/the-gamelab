"use server";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { comments } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/session";

export async function deleteComment({
  commentId,
  gameId,
}: {
  commentId: number;
  gameId: string;
}) {
  const user = await getUser();

  const [comment] = await db
    .select()
    .from(comments)
    .where(and(eq(comments.id, commentId), eq(comments.author, user.id)))
    .limit(1);

  if (!user.isAdmin && !comment) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db.delete(comments).where(eq(comments.id, commentId));
  } catch (error) {
    console.error("Error deleting comment:", error);
    // TODO Handle the error as needed (e.g., log it, throw an error, etc.)
    return { success: false, error: "Failed to delete comment" };
  }

  revalidatePath(`/game/${gameId}`);
  return { success: true };
}
