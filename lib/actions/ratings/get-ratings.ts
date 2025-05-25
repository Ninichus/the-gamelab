"use server";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { ratings as ratingsTable } from "@/db/schema";
import { canRead } from "@/lib/permissions";
import { getUser } from "@/lib/session";

export async function getRatings(gameId: string): Promise<
  | { success: false; error: string }
  | {
      success: true;
      averageRating?: number;
      numberOfRatings: number;
      userRating?: number | null;
    }
> {
  if (!(await canRead(gameId))) {
    return { success: false, error: "Unauthorized" };
  }

  const user = await getUser();

  const ratings = await db
    .select()
    .from(ratingsTable)
    .where(eq(ratingsTable.gameId, gameId));

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length
      : undefined;
  const numberOfRatings = ratings.length;
  const userRating = user
    ? ratings.find((r) => r.author === user.id)?.value ?? null
    : undefined;

  return {
    success: true,
    averageRating,
    numberOfRatings,
    userRating,
  };
}
