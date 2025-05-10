"use client";

export function GameDescription({
  game,
}: {
  game: {
    id: string;
    description: string | null;
  };
}) {
  return <p className="text-muted-foreground">{game.description}</p>;
}
