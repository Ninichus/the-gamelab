"use client";
import { GameCard } from "@/components/game-card";

type Game = {
  id: string;
  name: string;
  type: "board_game" | "cards_game" | "video_game";
  status: string;
  tags?: {
    id: number;
    name: string;
  }[];
  averageRating: number | null;
  imagePreview?: string;
  role?: string;
};

export function GamesList({ games }: { games: Game[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto pb-16 pt-4">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
