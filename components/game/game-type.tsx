"use client";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { updateGameType } from "@/lib/actions/update-game-type";

const legend = {
  board_game: "Board Game",
  cards_game: "Card Game",
  video_game: "Video Game",
};

//TODO start transition
//TODO add loading state

export function GameType({
  game,
  edit = false,
}: {
  game: { id: string; type: "board_game" | "cards_game" | "video_game" };
  edit?: boolean;
}) {
  return edit ? (
    <>
      <Select
        defaultValue={game.type}
        onValueChange={async (
          value: "board_game" | "cards_game" | "video_game"
        ) => await updateGameType(game.id, value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(legend).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  ) : (
    <Badge>{legend[game.type]}</Badge>
  );
}
