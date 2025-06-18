"use client";
import { Globe } from "lucide-react";
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
import Image from "next/image";

export function UpdateBrowseImage({ gameId }: { gameId: string }) {
  const [open, setOpen] = useState(false);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <Globe />
          Update Browse Image
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Browse Image</DialogTitle>
          <DialogDescription>
            The Browse Image is the image displayed in the explore page. It
            should be representative of your game and should be in a 16:9 aspect
            ratio.
          </DialogDescription>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!file) return;
              const formData = new FormData();
              formData.append("file", file);
              // we use xhr to have the progress event
              const xhr = new XMLHttpRequest();
              xhr.open("POST", `/upload/${gameId}?type=browse_image`, true);
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
                  //TODO : alert of an error
                  setFileUploadProgress(0);
                  setFile(null);
                  setIsUploading(false);
                }
              };
              setIsUploading(true);
              xhr.send(formData);
            }}
          >
            {file && (
              <div className="mb-4 flex justify-center">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Selected preview"
                  className="max-h-48 rounded shadow aspect-video object-cover"
                  width={1920}
                  height={1080}
                  loading="lazy"
                  onLoad={(e) =>
                    URL.revokeObjectURL((e.target as HTMLImageElement).src)
                  }
                />
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="cursor-pointer"
            />
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
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
