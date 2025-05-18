"use client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { removeTag } from "@/lib/actions/tags/remove-tag";

export function RemoveTag({
  tagId,
  gameId,
}: {
  tagId: number;
  gameId: string;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="group size-4 p-0"
      onClick={async () => {
        await removeTag({
          gameId,
          tagId,
        });
        //TODO Handle error
      }}
    >
      <X className="size-3 group-hover:text-destructive" />
    </Button>
  );
}
