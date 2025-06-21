"use server";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { comments as commentsTable, ratings, users } from "@/db/schema";
import { canRead } from "@/lib/permissions";
import { Comment } from "@/lib/types/comments";

export async function getComments(gameId: string): Promise<
  | { success: false; error: string }
  | {
      success: true;
      comments: Comment[];
    }
> {
  if (!(await canRead(gameId))) {
    return { success: false, error: "Unauthorized" };
  }

  const comments =
    (await db
      .select({
        id: commentsTable.id,
        content: commentsTable.content,
        authorFirstName: users.first_name,
        authorLastName: users.last_name,
        authorUsername: users.username,
        authorRating: ratings.value,
        createdAt: commentsTable.createdAt,
      })
      .from(commentsTable)
      .innerJoin(users, eq(users.id, commentsTable.author))
      .leftJoin(
        ratings,
        and(
          eq(ratings.author, commentsTable.author),
          eq(ratings.gameId, gameId)
        )
      )
      .where(eq(commentsTable.gameId, gameId))) ?? [];

  return { success: true, comments: comments };
}
