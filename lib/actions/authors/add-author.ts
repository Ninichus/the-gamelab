"use server";
import { db } from "@/db";
import { authors } from "@/db/schema";
import { canWrite } from "@/lib/permissions";

export async function addAuthor({
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
    await db.insert(authors).values({ gameId, userId, role });
  } catch (error) {
    return { success: false, error: "Failed to add author" };
  }

  return { success: true };
}
