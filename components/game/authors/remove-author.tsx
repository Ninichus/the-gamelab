"use client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { removeAuthor } from "@/lib/actions/authors/remove-author";

export function RemoveAuthor({
  gameId,
  userId,
}: {
  gameId: string;
  userId: number;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="group size-8 p-0"
      onClick={async () => {
        const result = await removeAuthor({ gameId, userId });
      }}
    >
      <X className="size-5 group-hover:text-destructive" />
    </Button>
  );
}
