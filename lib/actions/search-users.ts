"use server";
import { db } from "@/db";
import { and, like, or } from "drizzle-orm";
import { users as usersTable } from "@/db/schema";

export async function searchUsers({
  query,
  limit = 25,
  offset = 0,
}: {
  query: string;
  limit?: number;
  offset?: number;
}) {
  const users = await db
    .select({
      id: usersTable.id,
      firstName: usersTable.first_name,
      lastName: usersTable.last_name,
    })
    .from(usersTable)
    .where(
      and(
        ...query
          .split(" ")
          .map((part) =>
            or(
              like(usersTable.first_name, `%${part}%`),
              like(usersTable.last_name, `%${part}%`)
            )
          )
      )
    )
    .limit(limit)
    .offset(offset);

  return users;
}
