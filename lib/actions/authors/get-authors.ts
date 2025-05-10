"use server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { authors as authorsTable, users } from "@/db/schema";
import { canRead } from "@/lib/permissions";

export async function getAuthors(gameId: string): Promise<
  | { success: false; error: string }
  | {
      success: true;
      authors: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
        role: string | null;
      }[];
    }
> {
  if (!(await canRead(gameId))) {
    return { success: false, error: "Unauthorized" };
  }

  const authors =
    (await db
      .select({
        id: authorsTable.userId,
        username: users.username,
        first_name: users.first_name,
        last_name: users.last_name,
        role: authorsTable.role,
      })
      .from(authorsTable)
      .innerJoin(users, eq(users.id, authorsTable.userId))
      .where(eq(authorsTable.gameId, gameId))) ?? [];

  return { success: true, authors: authors };
}
