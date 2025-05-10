"use server";
import { getUser } from "@/lib/session";
import { db } from "@/db";
import { games, authors } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { unauthorized } from "next/navigation";
import { redirectToLogin } from "@/lib/actions/redirect-to-login";
import { GameCarousel } from "@/components/game/carousel/game-carousel";
import { TagsList } from "@/components/game/tags/tags-list";
import { CommentsSection } from "@/components/game/comments/comments-section";
import { GameType } from "@/components/game/game-type";
import { buildTabs } from "@/lib/actions/build-tabs";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

//TODO use canRead and redirect accordingly

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

  const tabs = await buildTabs({ game, edit: false });

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {game.name}
      </h1>
      <GameType game={{ id: game.id, type: game.type }} />
      <TagsList game={{ id: game.id }} />
      <GameCarousel game={{ id: game.id }} />
      <Tabs defaultValue="description" className="w-full">
        <TabsList>
          {Object.entries(tabs).map(([key, { display, icon }]) => (
            <TabsTrigger key={key} value={key} className="gap-1">
              {icon}
              {display}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(tabs).map(([key, { component }]) => (
          <TabsContent key={key} value={key}>
            {component}
          </TabsContent>
        ))}
      </Tabs>

      <CommentsSection />
    </>
  );
}
