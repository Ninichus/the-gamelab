"use client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteFile } from "@/lib/actions/files/delete-file";

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
      className="group size-4 p-0"
      onClick={async () => {
        await deleteFile({
          gameId,
          fileId,
        });
        //TODO Handle error
      }}
    >
      <X className="size-3 group-hover:text-destructive" />
    </Button>
  );
}
