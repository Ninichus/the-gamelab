"use server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { games } from "@/db/schema";
import { canWrite } from "@/lib/permissions";

export async function updateGameSpecs(gameId: string, specs: string) {
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
    await db.update(games).set({ specs }).where(eq(games.id, gameId));
  } catch (error) {
    console.error("Error updating game specs:", error);
    // TODO Handle the error as needed (e.g., log it, throw an error, etc.)
    return { success: false, error: "Failed to update game specs" };
  }

  return { success: true };
}
