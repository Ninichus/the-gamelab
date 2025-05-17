"use client";
import { useState } from "react";
import { SearchBar } from "@/components/browse/search-bar";
import { GamesList } from "@/components/browse/games-list";
import { QueryProvider } from "@/components/query-provider";

type Game = {
  id: string;
  name: string;
  type: "board_game" | "cards_game" | "video_game";
  status: string;
  tags: string[];
};

export default function BrowsePage() {
  const [games, setGames] = useState<Game[]>([]);
  return (
    <QueryProvider>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <SearchBar setGames={setGames} />
          <GamesList games={games} />
        </main>
      </div>
    </QueryProvider>
  );
}
