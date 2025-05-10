"use client";
import { Textarea } from "@/components/ui/textarea";
import { updateGameDescription } from "@/lib/actions/update-game-description";
import { useDebounce } from "@/hooks/use-debounce";
//TODO : usetransition and manage errors
//TODO : bold and italic text, change font size, add links, etc.

export function EditDescription({
  game,
}: {
  game: {
    id: string;
    description: string | null;
  };
}) {
  return (
    <div className="w-full">
      <Textarea
        name="description"
        rows={10}
        className="w-full"
        onChange={useDebounce((e) =>
          updateGameDescription(game.id, e.target.value)
        )}
        placeholder="Enter a description of your game"
        defaultValue={game.description ?? ""}
      />
    </div>
  );
}
