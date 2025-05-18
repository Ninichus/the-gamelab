"use server";
import { db } from "@/db";
import { and, like } from "drizzle-orm";
import { games as gamesTable } from "@/db/schema";

export async function searchGames({
  query,
  limit = 25,
  offset = 0,
}: {
  query: {
    search: string;
    filters: string[];
  };
  limit?: number;
  offset?: number;
}) {
  const games = await db
    .select()
    .from(gamesTable)
    .where(
      and(
        ...query.search
          .split(" ")
          .map((part) => like(gamesTable.name, `%${part}%`))
      )
    )
    .limit(limit)
    .offset(offset);

  //TODO:hanfle filters
  //TODO : handle tags

  return games;
}
