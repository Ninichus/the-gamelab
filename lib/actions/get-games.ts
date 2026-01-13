import "server-only";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import {
  authors,
  games as gamesTable,
  users,
  tags as tagsTable,
  files as filesTable,
} from "@/db/schema";
import { canRead } from "@/lib/permissions";
import { Game } from "../types/games";

export async function getGames(username: string) {
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
      role: authors.role,
      imagePreview: filesTable.id,
    })
    .from(gamesTable)
    .innerJoin(authors, eq(authors.gameId, gamesTable.id))
    .innerJoin(users, eq(users.id, authors.userId))
    .leftJoin(tagsTable, eq(tagsTable.gameId, gamesTable.id))
    .leftJoin(
      filesTable,
      and(
        eq(filesTable.gameId, gamesTable.id),
        eq(filesTable.type, "browse_image")
      )
    )
    .where(eq(users.username, username));

  const gamesMap = new Map<string, Game>();

  result.map((row) => {
    const game = row.games;
    const tag = row.tags;
    const imagePreview = row.imagePreview ? row.imagePreview : undefined;
    const role = row.role ? row.role : undefined;

    if (!gamesMap.has(game.id)) {
      gamesMap.set(game.id, { ...game, tags: [], imagePreview, role });
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
