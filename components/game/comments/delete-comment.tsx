"use client";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteComment } from "@/lib/actions/comments/delete-comment";
import { toast } from "sonner";

export function DeleteComment({
  gameId,
  commentId,
}: {
  gameId: string;
  commentId: number;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="group size-4 p-0 cursor-pointer hover:bg-foreground/10"
      onClick={async () => {
        const result = await deleteComment({
          gameId,
          commentId,
        });
        if (!result.success) {
          toast.error(
            result.error || "An error occurred while deleting the comment."
          );
        }
      }}
    >
      <Trash className="size-3 group-hover:text-destructive" />
    </Button>
  );
}
