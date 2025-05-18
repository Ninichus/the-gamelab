"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { games } from "@/db/schema";
import { canWrite } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function updateGameStatus({ gameId }: { gameId: string }) {
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

  if (game.status === "pending") {
    return { success: false, error: "Game is pending approval" };
  }

  //TODO : add approval by admin
  const newStatus = game.status === "published" ? "private" : "published";

  try {
    await db
      .update(games)
      .set({ status: newStatus })
      .where(eq(games.id, gameId));
  } catch (error) {
    console.error("Error updating game status:", error);
    // TODO Handle the error as needed (e.g., log it, throw an error, etc.)
    return { success: false, error: "Failed to update game status" };
  }

  revalidatePath(`/game/${gameId}`);
  return { success: true };
}
