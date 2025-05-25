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
import { EditGameBanner } from "@/components/game/edit-game-banner";
import { ManageGameButtons } from "@/components/game/manage-game-buttons";
import { DeleteGameBanner } from "@/components/game/delete-game";

//TODO better error handling + use canWrite and redirect accordingly

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
      <EditGameBanner
        game={{ id: game.id, status: game.status }}
        showEditButton={false}
        //isAdmin={user.isAdmin}
      />
      <div className="flex items-center justify-between mt-4 mb-2">
        <EditGameName game={{ id: game.id, name: game.name }} />
        <div>
          <ManageGameButtons game={{ status: game.status, id: gameId }} />
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-2">
        <GameType game={{ id: game.id, type: game.type }} edit={true} />
        <TagsList game={{ id: game.id }} edit={true} />
      </div>
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
      <DeleteGameBanner gameId={gameId} />
    </>
  );
}
