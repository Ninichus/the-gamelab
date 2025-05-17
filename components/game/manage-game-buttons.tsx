"use client";
import { Button } from "@/components/ui/button";
import { updateGameStatus } from "@/lib/actions/update-game-status";
import Link from "next/link";

export function ManageGameButtons({
  game,
}: {
  game: { id: string; status: "published" | "private" | "pending" };
}) {
  return (
    <>
      <Button>
        <Link href={`/game/${game.id}`}>Preview</Link>
      </Button>

      <Button
        variant="outline"
        className="ml-2"
        disabled={game.status === "pending"}
        onClick={async () => {
          await updateGameStatus({ gameId: game.id });
        }}
      >
        {game.status === "published" ? "Set Private" : "Set Public"}
      </Button>
    </>
  );
}
