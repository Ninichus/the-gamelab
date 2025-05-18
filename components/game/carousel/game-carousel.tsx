"use server";

import EmblaCarousel from "./embla-carousel";
import { EmblaOptionsType } from "embla-carousel";
import { getSlides } from "@/lib/actions/carousel/get-slides";
import { Error } from "@/components/error";

export async function GameCarousel({
  game,
  edit = false,
}: {
  game: { id: string };
  edit?: boolean;
}) {
  const options: EmblaOptionsType = {};
  const slides = await getSlides(game.id);
  if (!slides.success) {
    return <Error message={slides.error} />;
  }

  return (
    <div className="w-full">
      <EmblaCarousel
        options={options}
        slides={slides.slides}
        gameId={game.id}
        edit={edit}
      />
    </div>
  );
}
