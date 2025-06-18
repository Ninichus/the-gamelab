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
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { UpdateBrowseImage } from "@/components/update-browse-image";

//TODO better error handling + use canWrite and redirect accordingly
//TODO : button to delete image + add preview image + move images

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

  return (
    <div className="max-w-7xl mx-auto pb-4">
      <EditGameBanner
        game={{ id: game.id, status: game.status }}
        showEditButton={false}
        //isAdmin={user.isAdmin}
      />
      <Card className="p-6 mt-4">
        <CardTitle className="flex flex-col sm:flex-row justify-between mt-4 items-start gap-2">
          <div className="flex flex-col gap-1">
            <EditGameName game={{ id: game.id, name: game.name }} />
            <div className="flex flex-col sm:flex-row gap-2 justify-between items-start">
              <GameType game={{ id: game.id, type: game.type }} edit={true} />
              <UpdateBrowseImage gameId={game.id} />
            </div>
          </div>
          <div>
            <ManageGameButtons game={{ status: game.status, id: gameId }} />
          </div>
        </CardTitle>
        <CardContent className="flex flex-col gap-4">
          <GameCarousel game={{ id: game.id }} edit={true} />
          <TagsList game={{ id: game.id }} edit={true} />
          <Tabs defaultValue="description" className="w-full">
            <TabsList>
              {Object.entries(tabs).map(([key, { display, icon }]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="gap-1 cursor-pointer"
                >
                  {icon}
                  {display}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(tabs).map(([key, { component }]) => (
              <TabsContent
                key={key}
                value={key}
                className="bg-muted p-4 rounded-lg"
              >
                {component}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      <DeleteGameBanner gameId={gameId} />
    </div>
  );
}
