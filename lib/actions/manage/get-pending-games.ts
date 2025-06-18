"use server";
import { db } from "@/db";
import { eq, asc, and } from "drizzle-orm";
import {
  games as gamesTable,
  tags as tagsTable,
  files as filesTable,
} from "@/db/schema";
import { getUser } from "@/lib/session";

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

export async function getPendingGames(): Promise<
  | {
      success: true;
      games: GameWithTags[];
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
    .where(eq(gamesTable.status, "pending"))
    .leftJoin(tagsTable, eq(gamesTable.id, tagsTable.gameId))
    .leftJoin(
      filesTable,
      and(
        eq(gamesTable.id, filesTable.gameId),
        eq(filesTable.type, "browse_image")
      )
    )
    .orderBy(asc(gamesTable.updatedAt));

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

  const games = Array.from(gamesMap.values());
  return { success: true, games: games };
}
