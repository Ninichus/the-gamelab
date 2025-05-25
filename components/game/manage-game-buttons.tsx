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
      <Link href={`/game/${game.id}`}>
        <Button className="cursor-pointer">Preview</Button>
      </Link>

      <Button
        variant="outline"
        className="ml-2 cursor-pointer"
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
