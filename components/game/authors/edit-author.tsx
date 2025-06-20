"use client";
import { Button } from "@/components/ui/button";
import { PencilLine } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { editAuthor } from "@/lib/actions/authors/edit-author";
import { toast } from "sonner";

export function EditAuthor({
  gameId,
  authorId,
}: {
  gameId: string;
  authorId: number;
}) {
  const [open, setOpen] = useState(false);
  const [roleValue, setRoleValue] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <PencilLine className="mr-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit an author</DialogTitle>
          <DialogDescription>
            Authors are shown on the game page, in the credits section.
            Moreover, just as you are doing, they can edit the game.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="role" className="text-sm font-medium">
            Role
          </Label>
          <Input
            id="role"
            placeholder="Game Designer"
            className="w-full"
            onChange={(e) => {
              setRoleValue(e.target.value);
            }}
            value={roleValue}
          />
        </div>

        <DialogFooter className="flex justify-between sm:justify-between gap-2">
          <DialogClose asChild>
            <Button variant="secondary" className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={async () => {
              const result = await editAuthor({
                gameId,
                userId: authorId,
                role: roleValue !== "" ? roleValue : undefined,
              });
              if (!result.success) {
                toast.error(result.error || "Failed to edit author");
              }
              setOpen(false);
              setRoleValue("");
            }}
          >
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
