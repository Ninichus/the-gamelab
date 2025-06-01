"use client";

export function GameDescription({
  game,
}: {
  game: {
    id: string;
    description: string | null;
  };
}) {
  return <p>{game.description}</p>;
}
