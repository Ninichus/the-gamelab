"use server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { games } from "@/db/schema";
import { canWrite } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { GameType } from "../types/games";

export async function updateGameType(gameId: string, type: GameType) {
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
    await db.update(games).set({ type }).where(eq(games.id, gameId));
  } catch (error) {
    console.error("Error updating game type:", error);
    return { success: false, error: "Failed to update game type" };
  }

  revalidatePath(`/game/${gameId}`);
  return { success: true };
}
