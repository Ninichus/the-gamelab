"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
//import { approveGame } from "@/lib/actions/approve-game";

//TODO : add the approve game action ?

const legend = {
  published: "Public. Anyone can see it.",
  private: "Private. Only authors can see it.",
  pending: "Pending approval. Once approved by an admin, it will be public.",
};

export function EditGameBanner({
  game,
  showEditButton = true,
  isAdmin = false,
}: {
  game: { id: string; status: "published" | "private" | "pending" };
  showEditButton?: boolean;
  isAdmin?: boolean;
}) {
  return (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle>This game is {legend[game.status]}</CardTitle>
      </CardHeader>
      {showEditButton && (
        <CardContent className="flex gap-2 flex-col-reverse sm:flex-row">
          <Button size="sm">
            <Link href={`/game/${game.id}/edit`}>Edit</Link>
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

/*
{isAdmin && game.status === "pending" && (
  <Button
    size="sm"
    variant="outline"
    onClick={async () => {
      await approveGame(game.id);
    }}
  >
    Approve this game
  </Button>
)}
  */
