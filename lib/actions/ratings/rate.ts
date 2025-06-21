"use server";
import { db } from "@/db";
import { ratings, games } from "@/db/schema";
import { canRead } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/session";
import { eq, and, avg } from "drizzle-orm";

export async function modifyRating({
  gameId,
  rating,
}: {
  gameId: string;
  rating: number;
}) {
  // Everyone that can see the game can add a rate, if they are logged in
  if (!(await canRead(gameId))) {
    return { success: false, error: "Unauthorized" };
  }
  const user = await getUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const [existingRating] = await db
      .select()
      .from(ratings)
      .where(and(eq(ratings.gameId, gameId), eq(ratings.author, user.id)))
      .limit(1);

    if (existingRating) {
      await db
        .update(ratings)
        .set({ value: rating })
        .where(and(eq(ratings.gameId, gameId), eq(ratings.author, user.id)));
    } else {
      await db.insert(ratings).values({
        author: user.id,
        gameId,
        value: rating,
      });
    }

    const averageRating = await db
      .select({ averageRating: avg(ratings.value) })
      .from(ratings)
      .where(eq(ratings.gameId, gameId))
      .then(async (rows) => {
        return rows[0].averageRating !== null
          ? parseFloat(rows[0].averageRating)
          : null;
      });

    await db.update(games).set({ averageRating }).where(eq(games.id, gameId));
  } catch (error) {
    console.error("Error modifying rating:", error);
    return { success: false, error: "Failed to change rating" };
  }

  revalidatePath(`/game/${gameId}`);
  return { success: true };
}
