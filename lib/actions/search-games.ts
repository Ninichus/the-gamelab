"use server";
import { db } from "@/db";
import { and, like, eq, gte, lte } from "drizzle-orm";
import {
  files as filesTable,
  games as gamesTable,
  tags as tagsTable,
} from "@/db/schema";
import { GameType, Game } from "../types/games";

export async function searchGames({
  query,
  limit = 25,
  offset = 0,
}: {
  query: {
    search: string;
    filters: {
      type?: GameType;
      averageRating?: [number, number];
      tags?: string[];
      dates: { from: Date | undefined; to: Date | undefined };
    };
  };
  limit?: number;
  offset?: number;
}) {
  //console.log("Searching games with query:", query);
  const result = await db
    .select({
      games: {
        id: gamesTable.id,
        name: gamesTable.name,
        type: gamesTable.type,
        status: gamesTable.status,
        averageRating: gamesTable.averageRating,
        createdAt: gamesTable.createdAt,
      },
      tags: {
        id: tagsTable.id,
        name: tagsTable.name,
      },
      imagePreview: filesTable.id,
    })
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
        query.filters.type
          ? eq(gamesTable.type, query.filters.type)
          : undefined,
        query.filters.dates.from
          ? gte(gamesTable.createdAt, query.filters.dates.from)
          : undefined,
        query.filters.dates.to
          ? lte(gamesTable.createdAt, query.filters.dates.to)
          : undefined,
        eq(gamesTable.status, "published")
      )
    )
    .leftJoin(tagsTable, eq(gamesTable.id, tagsTable.gameId))
    .leftJoin(
      filesTable,
      and(
        eq(gamesTable.id, filesTable.gameId),
        eq(filesTable.type, "browse_image")
      )
    )
    .limit(limit)
    .offset(offset);

  const gamesMap = new Map<string, Game>();

  await Promise.all(
    result.map(async (row) => {
      const game = row.games;
      const tag = row.tags;
      let imagePreview;
      if (row.imagePreview === null) {
        const r = await db
          .select({ imagePreview: filesTable.id })
          .from(filesTable)
          .where(
            and(
              eq(filesTable.gameId, game.id),
              eq(filesTable.type, "carousel_image"),
              eq(filesTable.index, 0)
            )
          )
          .limit(1);
        imagePreview = r[0]?.imagePreview;
      } else {
        imagePreview = row.imagePreview;
      }

      if (!gamesMap.has(game.id)) {
        gamesMap.set(game.id, { ...game, tags: [], imagePreview });
      }

      if (tag && tag.id !== undefined) {
        gamesMap.get(game.id)!.tags!.push(tag);
      }
    })
  );

  // We don't need to check permissions here because we are only fetching published games.
  const games = Array.from(gamesMap.values());
  return games;
}
