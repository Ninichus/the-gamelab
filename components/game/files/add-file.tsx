"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export function AddFile({ gameId, index }: { gameId: string; index: number }) {
  const [open, setOpen] = useState(false);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full cursor-pointer">
          <Plus />
          Add a file
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a game file</DialogTitle>
          <DialogDescription>
            Please compress your game files before uploading them.
          </DialogDescription>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!file) return;
              const formData = new FormData();
              formData.append("file", file);
              // we use xhr to have the progress event
              const xhr = new XMLHttpRequest();
              xhr.open(
                "POST",
                `/upload/${gameId}?type=game_archive&index=${index}`,
                true
              );
              xhr.upload.addEventListener("progress", (e) => {
                setFileUploadProgress((e.loaded / e.total) * 100);
              });
              xhr.onload = () => {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                  setOpen(false);
                  setFileUploadProgress(0);
                  setFile(null);
                  setIsUploading(false);
                  window.location.reload();
                } else {
                  toast.error(response.error || "Failed to upload file");
                  setFileUploadProgress(0);
                  setFile(null);
                  setIsUploading(false);
                }
              };
              setIsUploading(true);
              xhr.send(formData);
            }}
          >
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="cursor-pointer"
            />
            <div>
              <Button
                type="submit"
                disabled={!file || isUploading}
                className="cursor-pointer"
              >
                Upload
              </Button>
              {isUploading && (
                <Progress
                  value={fileUploadProgress}
                  className="w-full mt-2"
                  style={{
                    backgroundColor: "green",
                    height: "5px",
                    borderRadius: "5px",
                  }}
                />
              )}
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
