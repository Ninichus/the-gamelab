"use server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { canRead } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/session";

export async function addComment({
  gameId,
  comment,
}: {
  gameId: string;
  comment: string;
}) {
  // Everyone that can see the game can add a comment, if they are logged in
  if (!(await canRead(gameId))) {
    return { success: false, error: "Unauthorized" };
  }
  const user = await getUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    //TODO Validate comments ? draft mode...
    await db.insert(comments).values({
      gameId,
      author: user.id,
      content: comment,
      status: "published",
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    // TODO Handle the error as needed (e.g., log it, throw an error, etc.)
    return { success: false, error: "Failed to add comment" };
  }

  revalidatePath(`/game/${gameId}`);
  return { success: true };
}
