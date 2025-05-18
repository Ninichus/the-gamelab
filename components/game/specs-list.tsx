"use client";

export function SpecsList({
  game,
  edit = false,
}: {
  game: { id: string };
  edit?: boolean;
}) {
  console.log("SpecsList", game.id, edit); //TODO: remove this
  return <div className="w-full"></div>;
}
