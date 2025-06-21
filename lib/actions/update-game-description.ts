"use server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { games } from "@/db/schema";
import { canWrite } from "@/lib/permissions";

export async function updateGameDescription(
  gameId: string,
  description: string
) {
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
    await db.update(games).set({ description }).where(eq(games.id, gameId));
  } catch (error) {
    console.error("Error updating game description:", error);
    return { success: false, error: "Failed to update game description" };
  }

  return { success: true };
}
