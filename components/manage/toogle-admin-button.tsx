"use client";

import { ShieldCheck, ShieldOff } from "lucide-react";
import { Button } from "../ui/button";
import { toggleAdmin } from "@/lib/actions/manage/toggle-admin";
import { toast } from "sonner";

export function ToggleAdminButton({
  userId,
  isAdmin,
}: {
  userId: number;
  isAdmin: boolean;
}) {
  return (
    <Button
      className="cursor-pointer hover:opacity-80"
      variant={isAdmin ? "destructive" : "default"}
      size="sm"
      onClick={async () => {
        const result = await toggleAdmin({ userId });
        if (!result.success) {
          toast.error(
            result.error || "An error occurred while toggling admin status."
          );
        }
      }}
    >
      {isAdmin ? (
        <ShieldOff className="h-3 w-3 mr-1" />
      ) : (
        <ShieldCheck className="h-3 w-3 mr-1" />
      )}
      {isAdmin ? "Remove Admin" : "Make Admin"}
    </Button>
  );
}
