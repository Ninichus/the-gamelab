"use server";
import { db } from "@/db";
import { and, like, eq, gte, lte } from "drizzle-orm";
import {
  files as filesTable,
  games as gamesTable,
  tags as tagsTable,
} from "@/db/schema";
import { canRead } from "../permissions";

type GameWithTags = {
  id: string;
  name: string;
  type: "board_game" | "cards_game" | "video_game";
  status: string;
  tags?: {
    id: number;
    name: string;
  }[];
  averageRating: number | null;
  imagePreview?: string;
};

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
  const result = await db
    .select({
      games: {
        id: gamesTable.id,
        name: gamesTable.name,
        type: gamesTable.type,
        status: gamesTable.status,
        averageRating: gamesTable.averageRating,
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
        query.filters.type ? eq(gamesTable.type, query.filters.type) : undefined
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

  const gamesMap = new Map<string, GameWithTags>();

  result.map((row) => {
    const game = row.games;
    const tag = row.tags;
    const imagePreview = row.imagePreview ? row.imagePreview : undefined;

    if (!gamesMap.has(game.id)) {
      gamesMap.set(game.id, { ...game, tags: [], imagePreview });
    }

    if (tag && tag.id !== undefined) {
      gamesMap.get(game.id)!.tags!.push(tag);
    }
  });

  // Filter games by permissions
  const games = Array.from(gamesMap.values());
  const permissions = await Promise.all(
    games.map(async (game) => ({
      id: game.id,
      canRead: await canRead(game.id),
    }))
  );

  return games.filter(
    (game) => permissions.find((p) => p.id === game.id)?.canRead
  );
}
