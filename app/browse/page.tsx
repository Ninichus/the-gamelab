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
  tags?: {
    id: number;
    name: string;
  }[];
  averageRating: number | null;
  imagePreview?: string;
};

export default function BrowsePage() {
  const [games, setGames] = useState<Game[]>([]);
  return (
    <QueryProvider>
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-orange-500 text-white py-16">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold">Browse Games</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Discover amazing games created by students during their English
            courses
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <SearchBar setGames={setGames} />
        </div>
      </div>
      <GamesList games={games} />
    </QueryProvider>
  );
}
