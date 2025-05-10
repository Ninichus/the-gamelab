"use server";
import { db } from "@/db";
import { eq, InferInsertModel } from "drizzle-orm";
import { games } from "@/db/schema";
import { canWrite } from "@/lib/permissions";

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
    return { success: false, error: "Failed to update game type" };
  }

  return { success: true };
}
