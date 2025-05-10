"use server";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { authors } from "@/db/schema";
import { canWrite } from "@/lib/permissions";

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
    return { success: false, error: "Failed to remove author" };
  }

  return { success: true };
}
