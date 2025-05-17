"use server";
import { Badge } from "@/components/ui/badge";
import { getAllTags, getTags } from "@/lib/actions/tags/get-tags";
import { Error } from "@/components/error";
import { AddTag } from "@/components/game/tags/add-tag";
import { RemoveTag } from "@/components/game/tags/remove-tag";

//TODO handle errors with toast

export async function TagsList({
  game,
  edit = false,
}: {
  game: { id: string };
  edit?: boolean;
}) {
  const result = await getTags(game.id);
  if (!result.success) {
    return <Error message={result.error} />;
  }
  const tags = result.tags;
  return (
    <div className="w-full">
      {tags.map((tag) => (
        <Badge key={tag.id}>
          {tag.name}
          {edit && <RemoveTag gameId={game.id} tagId={tag.id} />}
        </Badge>
      ))}
      {edit && (
        <AddTag
          gameId={game.id}
          tags={(await getAllTags()).tags}
          currentTags={tags}
        />
      )}
    </div>
  );
}
