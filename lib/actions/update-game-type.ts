"use server";
import { db } from "@/db";
import { eq, InferInsertModel } from "drizzle-orm";
import { games } from "@/db/schema";
import { canWrite } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function updateGameType(
  gameId: string,
  type: InferInsertModel<typeof games>["type"]
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
    await db.update(games).set({ type }).where(eq(games.id, gameId));
  } catch (error) {
    console.error("Error updating game type:", error);
    // TODO Handle the error as needed (e.g., log it, throw an error, etc.)
    return { success: false, error: "Failed to update game type" };
  }

  revalidatePath(`/game/${gameId}`);
  return { success: true };
}
