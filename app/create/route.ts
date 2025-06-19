import { getUser } from "@/lib/session";
import { customAlphabet } from "nanoid";
import { db } from "@/db";
import { games, authors } from "@/db/schema/";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

//TODO : optimize this, we don't need to create a new game if the user already has a void one

const nanoid = customAlphabet("1234567890abcdef");

export const dynamic = "force-dynamic";

export async function GET() {
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

  revalidatePath(`/profile/${user.username}`);
  return NextResponse.redirect(
    new URL(`/game/${gameId}/edit`, process.env.WEB_URL)
  );
}
