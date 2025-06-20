"use client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { removeAuthor } from "@/lib/actions/authors/remove-author";
import { toast } from "sonner";

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
      className="group size-8 p-0 cursor-pointer"
      onClick={async () => {
        const result = await removeAuthor({ gameId, userId });
        if (!result.success) {
          toast.error(
            result.error || "An error occurred while removing the author."
          );
        }
      }}
    >
      <X className="size-5 group-hover:text-destructive" />
    </Button>
  );
}
