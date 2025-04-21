"use server";
import { getUser } from "@/lib/session";
import { db } from "@/db";
import { games, authors } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirectToLogin } from "@/lib/actions/redirect-to-login";
import { unauthorized } from "next/navigation";

export default async function EditGamePage({
  params,
}: {
  params: { id: string };
}) {
  const gameId = params.id;
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
