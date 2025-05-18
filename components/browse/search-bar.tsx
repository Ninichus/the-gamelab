"use client";

import { Funnel } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchGames } from "@/lib/actions/search-games";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Game = {
  id: string;
  name: string;
  type: "board_game" | "cards_game" | "video_game";
  status: string;
  tags?: string[];
};

export function SearchBar({ setGames }: { setGames: (games: Game[]) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]); // Filters while the dialog is open
  const [filters, setFilters] = useState([]); //Filters used to query
  useQuery({
    //TODO : use isLoading to show a loading state
    queryKey: ["games", search, filters],
    queryFn: async () => {
      if (!search) return [];
      const games = await searchGames({
        query: { search, filters },
        limit: 25,
        offset: 0,
      });
      setGames(games);
    },
    enabled: search.length >= 2 || filters.some((f) => f !== undefined),
  });

  return (
    <div>
      <Input
        placeholder="Search a game"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Funnel className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select filters</DialogTitle>
            <DialogDescription>
              Games matching your filters will be shown.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between gap-2">
            <DialogClose asChild>
              <Button
                variant="secondary"
                onClick={() => {
                  setOpen(false);
                  setSelectedFilters(filters);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={() => {
                setOpen(false);
                setFilters(selectedFilters);
              }}
            >
              Apply filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
