import "server-only";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import {
  authors,
  games as gamesTable,
  users,
  tags as tagsTable,
} from "@/db/schema";
import { canRead } from "@/lib/permissions";

export async function getGames(username: string) {
  const games = await db
    .select({
      id: gamesTable.id,
      name: gamesTable.name,
      type: gamesTable.type,
      status: gamesTable.status,
    })
    .from(gamesTable)
    .leftJoin(authors, eq(authors.gameId, gamesTable.id))
    .innerJoin(users, eq(users.id, authors.userId))
    .where(eq(users.username, username));

  const results = await Promise.all(
    games.map(async (game) => ({
      game,
      canRead: await canRead(game.id),
      role: (
        await db
          .select({ role: authors.role })
          .from(authors)
          .innerJoin(users, eq(users.id, authors.userId))
          .where(and(eq(authors.gameId, game.id), eq(users.username, username)))
      )[0].role,
      tags: await db
        .select({ id: tagsTable.id, name: tagsTable.name })
        .from(tagsTable)
        .where(eq(tagsTable.gameId, game.id)),
    }))
  );

  const filteredGames = results
    .filter((result) => result.canRead)
    .map((result) => {
      return { game: result.game, role: result.role, tags: result.tags };
    });

  return { games: filteredGames };
}
