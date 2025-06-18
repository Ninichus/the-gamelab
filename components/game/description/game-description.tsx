"use client";

export function GameDescription({
  game,
}: {
  game: {
    id: string;
    description: string | null;
  };
}) {
  return (
    <pre className="font-sans whitespace-pre-wrap">{game.description}</pre>
  );
}
