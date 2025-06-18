"use server";
import { db } from "@/db";
import { desc, eq, count } from "drizzle-orm";
import { authors, users as usersTable } from "@/db/schema";
import { getUser } from "@/lib/session";

export async function getUsers(): Promise<
  | {
      success: true;
      users: {
        id: number;
        username: string;
        email: string;
        isAdmin: boolean;
        gamesCreated: number;
        firstName: string;
        lastName: string;
      }[];
    }
  | {
      success: false;
      error: string;
    }
> {
  const user = await getUser();
  if (!user || !user.isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  const users = await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      email: usersTable.email,
      isAdmin: usersTable.isAdmin,
      gamesCreated: count(authors.id),
      firstName: usersTable.first_name,
      lastName: usersTable.last_name,
    })
    .from(usersTable)
    .leftJoin(authors, eq(authors.userId, usersTable.id))
    .groupBy(usersTable.id)
    .orderBy(desc(usersTable.isAdmin));
  return { success: true, users: users };
}
