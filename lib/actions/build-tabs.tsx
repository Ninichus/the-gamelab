"use server";
import { InferSelectModel } from "drizzle-orm";
import { games } from "@/db/schema";
import { EditDescription } from "@/components/game/description/edit-description";
import { GameDescription } from "@/components/game/description/game-description";
import { FilesList } from "@/components/game/files/files-list";
import { AuthorsList } from "@/components/game/authors/authors-list";
import { SpecsList } from "@/components/game/specs-list";

type Game = InferSelectModel<typeof games>;

type Tab = {
  display: string;
  icon: React.ReactElement;
  component: React.ReactElement;
};

type Tabs = {
  description: Tab;
  files: Tab;
  authors: Tab;
  specs?: Tab;
};

export async function buildTabs({
  game,
  edit = false,
}: {
  game: Game;
  edit: boolean;
}): Promise<Tabs> {
  let tabs: Tabs = {
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
  };

  if (game.type === "video_game") {
    tabs = {
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
        component: (
          <SpecsList game={{ id: game.id, specs: game.specs }} edit={edit} />
        ),
      },
    };
  }

  return tabs;
}
