"use server";
import { getUser } from "@/lib/session";
import { db } from "@/db";
import { games, authors } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirectToLogin } from "@/lib/actions/redirect-to-login";
import { unauthorized } from "next/navigation";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { buildTabs } from "@/lib/actions/build-tabs";
import { EditGameName } from "@/components/game/edit-game-name";
import { TagsList } from "@/components/game/tags/tags-list";
import { GameType } from "@/components/game/game-type";
import { GameCarousel } from "@/components/game/carousel/game-carousel";

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
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

  const tabs = await buildTabs({ game, edit: true });

  //TODO : add a banner button
  //TODO : add the game status, with a button to publish/unpublish
  //TODO : add a preview button

  return (
    <>
      <EditGameName game={{ id: game.id, name: game.name }} />
      <GameType game={{ id: game.id, type: game.type }} edit={true} />
      <TagsList game={{ id: game.id }} edit={true} />
      <GameCarousel game={{ id: game.id }} edit={true} />
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
    </>
  );
}
