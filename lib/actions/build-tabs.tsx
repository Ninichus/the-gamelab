"use server";
import { InferSelectModel } from "drizzle-orm";
import { games } from "@/db/schema";
import { EditDescription } from "@/components/game/description/edit-description";
import { GameDescription } from "@/components/game/description/game-description";
import { FilesList } from "@/components/game/files/files-list";
import { AuthorsList } from "@/components/game/authors/authors-list";
import { SpecsList } from "@/components/game/specs-list";

type Game = InferSelectModel<typeof games>;

export async function buildTabs({
  game,
  edit = false,
}: {
  game: Game;
  edit: boolean;
}) {
  const tabs = {
    description: {
      display: "Description",
      icon: <></>,
      component: edit ? (
        <EditDescription
          game={{ id: game.id, description: game.description }}
        />
      ) : (
        <GameDescription
          game={{ id: game.id, description: game.description }}
        />
      ),
    },
    files: {
      display: "Files",
      icon: <></>,
      component: <FilesList game={{ id: game.id }} edit={edit} />,
    },
    authors: {
      display: "Authors",
      icon: <></>,
      component: <AuthorsList game={{ id: game.id }} edit={edit} />,
    },
    specs: {
      display: "Specs",
      icon: <></>,
      component: <SpecsList game={{ id: game.id }} edit={edit} />,
    },
  };

  return tabs;
}
