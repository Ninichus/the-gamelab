"use server";
import { getUser } from "@/lib/session";
import { db } from "@/db";
import { games, authors } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { unauthorized } from "next/navigation";
import { redirectToLogin } from "@/lib/actions/redirect-to-login";

export default async function GamePage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const gameId = (await params).id;
  if (!gameId) {
    return Response.json(
      { success: false, error: "Game ID is required" },
      { status: 400 }
    );
  }

  const [game] = await db.select().from(games).where(eq(games.id, gameId));
  if (!game) {
    return Response.json(
      { success: false, error: "Invalid Game ID" },
      { status: 400 }
    );
  }

  // Published games are public
  if (game.status !== "published") {
    // Check if the user is amongst the authors of the game
    const user = await getUser();
    if (!user) {
      return redirectToLogin(`/game/${gameId}`);
    }

    const [author] = await db
      .select()
      .from(authors)
      .where(and(eq(authors.gameId, gameId), eq(authors.userId, user.id)));

    if (!author && !user.isAdmin) {
      unauthorized();
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {game.name}
      </h1>
      <p className="text-muted-foreground">{game.description}</p>
    </>
  );
}

//Tag, comments, images, authors, specs...
