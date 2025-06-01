"use server";
import { db } from "@/db";
import { and, like, eq, gte, lte } from "drizzle-orm";
import { games as gamesTable } from "@/db/schema";
import { canRead } from "../permissions";

export async function searchGames({
  query,
  limit = 25,
  offset = 0,
}: {
  query: {
    search: string;
    filters: {
      type?: "board_game" | "cards_game" | "video_game";
      averageRating?: [number, number];
      tags?: string[];
    };
  };
  limit?: number;
  offset?: number;
}) {
  console.log("Searching games with query:", query);
  const games = await db
    .select()
    .from(gamesTable)
    .where(
      and(
        ...query.search
          .split(" ")
          .map((part) => like(gamesTable.name, `%${part}%`)),
        query.filters.averageRating &&
          (query.filters.averageRating[0] !== 1 ||
            query.filters.averageRating[1] !== 10)
          ? gte(gamesTable.averageRating, query.filters.averageRating[0])
          : undefined,
        query.filters.averageRating &&
          (query.filters.averageRating[0] !== 1 ||
            query.filters.averageRating[1] !== 10)
          ? lte(gamesTable.averageRating, query.filters.averageRating[1])
          : undefined,
        query.filters.type ? eq(gamesTable.type, query.filters.type) : undefined
      )
    )
    .limit(limit)
    .offset(offset);

  //TODO : handle tags
  const permissions = await Promise.all(
    games.map(async (game) => {
      return {
        id: game.id,
        canRead: await canRead(game.id),
      };
    })
  );

  return games.filter(
    (game) => permissions.find((p) => p.id === game.id)?.canRead
  );
}
