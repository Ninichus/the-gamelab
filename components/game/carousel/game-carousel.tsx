"use client";

import EmblaCarousel from "./embla-carousel";
import { EmblaOptionsType } from "embla-carousel";
import "@/public/embla.css";

export function GameCarousel({
  game,
  edit = false,
}: {
  game: { id: string };
  edit?: boolean;
}) {
  const options: EmblaOptionsType = {};

  return (
    <div className="w-full">
      <EmblaCarousel options={options} slides={[0, 1, 2, 3, 4, 5]} />
    </div>
  );
}
