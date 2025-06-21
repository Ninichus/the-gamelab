"use client";
import { Button } from "@/components/ui/button";
import { updateGameStatus } from "@/lib/actions/update-game-status";
import { GameStatus } from "@/lib/types/games";
import Link from "next/link";

export function ManageGameButtons({
  game,
}: {
  game: { id: string; status: GameStatus };
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2">
      <div className="w-full sm:w-auto">
        <Link href={`/game/${game.id}`} className="block w-full">
          <Button className="cursor-pointer w-full sm:w-auto">Preview</Button>
        </Link>
      </div>
      <div className="w-full sm:w-auto">
        <Button
          variant="outline"
          className="cursor-pointer w-full sm:w-auto"
          disabled={game.status === "pending"}
          onClick={async () => {
            await updateGameStatus({ gameId: game.id });
          }}
        >
          {game.status === "published" ? "Set Private" : "Set Public"}
        </Button>
      </div>
    </div>
  );
}
