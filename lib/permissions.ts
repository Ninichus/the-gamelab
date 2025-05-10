import "server-only";
import { getUser } from "@/lib/session";
import { db } from "@/db";
import { authors,games } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function canWrite(gameId: string) {
    const user = await getUser();

    if (!user) {
        return false;
    }
    if (user.isAdmin) {
        return true;
    }
    const [author] = await db
        .select()
        .from(authors)
        .where(and(eq(authors.gameId, gameId), eq(authors.userId, user.id))).limit(1);
    if (author) {
        return true;
    }
    return false;
}

export async function canRead(gameId: string) {
    const [game] = await db.select().from(games).where(eq(games.id, gameId));
    if (!game) {
        return false;
    }

    // Published games are public
    if (game.status !== "published") {
        // Check if the user is amongst the authors of the game
        const user = await getUser();
        if (!user) {
            return false;
        }

        const [author] = await db
            .select()
            .from(authors)
            .where(and(eq(authors.gameId, gameId), eq(authors.userId, user.id)));

        if (!author && !user.isAdmin) {
            return false;
        }
    }

    return true;
}