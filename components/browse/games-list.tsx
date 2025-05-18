"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Game = {
  id: string;
  name: string;
  type: "board_game" | "cards_game" | "video_game";
  status: string;
  tags?: string[];
};

const legend = {
  board_game: "Board Game",
  cards_game: "Card Game",
  video_game: "Video Game",
};

export function GamesList({ games }: { games: Game[] }) {
  return (
    <ul>
      {games.map((game) => (
        <li key={game.id}>
          <Link
            href={`/game/${game.id}`}
            className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-md"
          >
            <span className="text-sm font-medium">{game.name}</span>
            <Badge className="text-xs">{legend[game.type]}</Badge>
            <Badge className="text-xs">{game.status}</Badge>
            {game.tags &&
              game.tags.map((tag) => (
                <Badge key={tag} className="text-xs">
                  {tag}
                </Badge>
              ))}
          </Link>
        </li>
      ))}
    </ul>
  );
}
