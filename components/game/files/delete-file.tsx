"use client";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteFile } from "@/lib/actions/files/delete-file";
import { toast } from "sonner";

export function DeleteFile({
  gameId,
  fileId,
}: {
  gameId: string;
  fileId: string;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="group size-4 p-0 cursor-pointer"
      onClick={async () => {
        const result = await deleteFile({
          gameId,
          fileId,
        });
        if (!result.success) {
          toast.error(
            result.error || "An error occurred while deleting the file."
          );
        }
      }}
    >
      <Trash className="size-3 group-hover:text-destructive" />
    </Button>
  );
}
