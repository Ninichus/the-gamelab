import "server-only";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { authors, games as gamesTable, users } from "@/db/schema";
import { canRead } from "@/lib/permissions";

export async function getGames(username: string) {
  const games = await db
    .select({ id: gamesTable.id, name: gamesTable.name })
    .from(gamesTable)
    .leftJoin(authors, eq(authors.gameId, gamesTable.id))
    .innerJoin(users, eq(users.id, authors.userId))
    .where(eq(users.username, username));

  //TODO : optimize
  const filteredGames = games.filter(async (game) => await canRead(game.id));

  return { games: filteredGames };
}
