"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteGame } from "@/lib/actions/delete-game";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export function DeleteGameBanner({ gameId }: { gameId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="mt-4 border-destructive">
      <CardHeader>
        <CardTitle>Delete this game</CardTitle>
      </CardHeader>

      <CardContent className="flex gap-2 flex-col-reverse sm:flex-row">
        <div>
          <p className="text-sm text-red-500">
            This action is irreversible. All data related to this game will be
            permanently deleted.
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant={"destructive"}
                size="sm"
                className="cursor-pointer"
              >
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm deletion</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. Are you sure you want to delete
                  this game ?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-between sm:justify-between gap-2">
                <Button
                  variant={"destructive"}
                  className="cursor-pointer"
                  onClick={async () => {
                    setOpen(false);
                    const result = await deleteGame(gameId);
                    if (result.success) {
                      window.location.href = "/";
                    } else {
                      //TODO handle error properly
                      alert(
                        result.error ||
                          "An error occurred while deleting the game."
                      );
                    }
                  }}
                >
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
