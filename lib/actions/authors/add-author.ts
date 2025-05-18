"use server";
import { db } from "@/db";
import { authors } from "@/db/schema";
import { canWrite } from "@/lib/permissions";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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

  const [existingAuthor] = await db
    .select()
    .from(authors)
    .where(and(eq(authors.gameId, gameId), eq(authors.userId, userId)))
    .limit(1);
  if (existingAuthor) {
    return { success: false, error: "Author already exists" };
  }

  try {
    await db.insert(authors).values({ gameId, userId, role });
  } catch (error) {
    console.error("Error adding author:", error);
    // TODO Handle the error as needed (e.g., log it, throw an error, etc.)
    return { success: false, error: "Failed to add author" };
  }

  revalidatePath(`/game/${gameId}`);
  return { success: true };
}
