"use client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { removeTag } from "@/lib/actions/tags/remove-tag";
import { toast } from "sonner";

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
      className="group size-4 p-0 cursor-pointer"
      onClick={async () => {
        const result = await removeTag({
          gameId,
          tagId,
        });
        if (!result.success) {
          toast.error(
            result.error || "An error occurred while removing the tag."
          );
        }
      }}
    >
      <X className="size-3 group-hover:text-destructive" />
    </Button>
  );
}
