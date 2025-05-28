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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

const typeLegend: Record<string, string> = {
  board_game: "Board Game",
  cards_game: "Cards Game",
  video_game: "Video Game",
};

type Game = {
  id: string;
  name: string;
  type: "board_game" | "cards_game" | "video_game";
  status: string;
  tags?: string[];
};

type Filters = {
  type?: "board_game" | "cards_game" | "video_game";
  averageRating: [number, number];
  tags: string[];
};

export function SearchBar({ setGames }: { setGames: (games: Game[]) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    type: undefined,
    averageRating: [1, 10],
    tags: [],
  }); // Filters while the dialog is open
  const [filters, setFilters] = useState<Filters>({
    type: undefined,
    averageRating: [1, 10],
    tags: [],
  }); //Filters used to query
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
          <Button className="cursor-pointer">
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

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Game Type</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                {(["board_game", "cards_game", "video_game"] as const).map(
                  (type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      onSelect={() => {
                        setSelectedFilters((prev) => ({
                          ...prev,
                          type: prev.type === type ? undefined : type,
                        }));
                      }}
                    >
                      {typeLegend[type]}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Average Rating</Label>
            <Slider
              min={1}
              max={10}
              step={0.1}
              defaultValue={[1, 10]}
              onValueChange={(value) =>
                setSelectedFilters((prev) => ({
                  ...prev,
                  averageRating: [Math.min(...value), Math.max(...value)],
                }))
              }
            />
          </div>

          <DialogFooter className="flex justify-between sm:justify-between gap-2">
            <DialogClose asChild>
              <Button
                variant="secondary"
                className="cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  setSelectedFilters(filters);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="cursor-pointer"
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
