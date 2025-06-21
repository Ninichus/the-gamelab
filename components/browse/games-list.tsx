"use client";
import { GameCard } from "@/components/game-card";
import { Game } from "@/lib/types/games";

export function GamesList({ games }: { games: Game[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto pb-16 pt-4">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
