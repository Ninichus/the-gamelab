import { getUser } from "@/lib/session";
import { customAlphabet } from "nanoid";
import { db } from "@/db";
import { games, authors } from "@/db/schema/";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

const nanoid = customAlphabet("1234567890abcdef");

export const dynamic = "force-dynamic";

export async function GET() {
  //TODO : generate a gameid and redirect to the game page
  const user = await getUser();
  if (!user) {
    throw new Error("Middleware failure");
  }

  const gameId = nanoid(40);
  try {
    await db.transaction(async (tx) => {
      await tx.insert(games).values({
        id: gameId,
        name: "New Game",
        description: "Description",
        type: "board_game",
        status: "private",
      });

      await tx.insert(authors).values({
        gameId: gameId,
        userId: user.id,
      });
    });
  } catch (error) {
    console.error("Error creating game:", error);
    return new Response("Error creating game", { status: 500 });
  }

  return NextResponse.redirect(
    new URL(`/game/${gameId}/edit`, process.env.WEB_URL)
  );
}
