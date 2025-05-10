"use client";
import { Input } from "@/components/ui/input";
import { updateGameName } from "@/lib/actions/update-game-name";
import { useDebounce } from "@/hooks/use-debounce";
//TODO : usetransition and manage errors

export function EditGameName({ game }: { game: { id: string; name: string } }) {
  return (
    <>
      <div>
        <Input
          name="name"
          className="!text-3xl font-bold tracking-tight text-foreground sm:text-4xl w-auto py-6"
          onChange={useDebounce((e) => updateGameName(game.id, e.target.value))}
          defaultValue={game.name}
          placeholder="My awesome game"
        />
      </div>
    </>
  );
}
