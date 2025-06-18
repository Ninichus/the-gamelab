"use client";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";
import { updateGameSpecs } from "@/lib/actions/update-specs";

export function SpecsList({
  game,
  edit = false,
}: {
  game: { id: string; specs?: string | null };
  edit?: boolean;
}) {
  const handleUpdate = useDebounce((e) =>
    updateGameSpecs(game.id, e.target.value)
  );

  return (
    <div className="w-full">
      {edit ? (
        <Textarea
          name="description"
          rows={10}
          className="w-full"
          onChange={handleUpdate}
          placeholder={`RAM: 16GB\nCPU: Intel i7\nGPU: NVIDIA RTX 3080\nStorage: 10GB SSD`}
          defaultValue={game.specs ?? ""}
        />
      ) : (
        <pre className="font-sans whitespace-pre-wrap">{game.specs}</pre>
      )}
    </div>
  );
}
