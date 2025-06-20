"use client";

import "@/public/embla.css";
import React, { useState, useEffect, useCallback } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { Thumb, UploadThumb } from "./embla-carousel-thumbs";
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
import { CircleX, Redo, Trash, Undo } from "lucide-react";
import { moveSlide } from "@/lib/actions/carousel/move-slide";
import { deleteSlide } from "@/lib/actions/carousel/delete-slide";
import { toast } from "sonner";

//TODO : lazy load images and videos
//TODO : fullscreen image on click

type PropType = {
  slides: { id: string; index: number | null; type: string }[];
  gameId: string;
  options?: EmblaOptionsType;
  edit?: boolean;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options, edit, gameId } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const [open, setOpen] = useState(false);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();

    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  //TODO fill=true property on Image
  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaMainRef}>
        <div className="embla__container">
          {slides.length > 0 ? (
            slides
              .filter((slide) =>
                ["carousel_image", "carousel_video"].includes(slide.type)
              )
              .map((slide, index) => (
                <div className="embla__slide" key={index}>
                  {slide.type === "carousel_video" ? (
                    <video
                      className="embla__slide__video w-full h-full object-cover aspect-video max-w-full max-h-full block bg-muted rounded-2xl"
                      poster={`/download/${slide.id.slice(0, -2)}_t`}
                      width={1920}
                      height={1080}
                      controls
                    >
                      <source src={`/download/${slide.id}`} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      className="embla__slide__image w-full h-full object-cover aspect-video max-w-full max-h-full block bg-muted rounded-2xl"
                      src={`/download/${slide.id}`}
                      alt={`Carousel ${index}`}
                      width={1920}
                      height={1080}
                    />
                  )}
                  {edit && index === selectedIndex && (
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <Button
                        size="icon"
                        disabled={index === 0}
                        title="Move Left"
                        className="cursor-pointer hover:bg-muted/10"
                        onClick={async () => {
                          const result = await moveSlide({
                            gameId,
                            slideIndex: index,
                            delta: -1,
                          });
                          if (!result.success) {
                            toast.error(result.error || "Failed to move slide");
                          }
                        }}
                      >
                        <Undo className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        title="Delete"
                        className="cursor-pointer hover:bg-red-800"
                        onClick={async () => {
                          const result = await deleteSlide({
                            gameId,
                            slideIndex: index,
                          });
                          if (!result.success) {
                            toast.error(
                              result.error || "Failed to delete slide"
                            );
                          }
                        }}
                      >
                        <Trash className="w-5 h-5" />
                      </Button>
                      <Button
                        size="icon"
                        disabled={
                          index ===
                          slides.filter((s) =>
                            ["carousel_image", "carousel_video"].includes(
                              s.type
                            )
                          ).length -
                            1
                        }
                        title="Move Right"
                        className="cursor-pointer hover:bg-muted/10"
                        onClick={async () => {
                          const result = await moveSlide({
                            gameId,
                            slideIndex: index,
                            delta: 1,
                          });
                          if (!result.success) {
                            toast.error(result.error || "Failed to move slide");
                          }
                        }}
                      >
                        <Redo className="w-5 h-5" />
                      </Button>
                    </div>
                  )}
                </div>
              ))
          ) : edit ? (
            <div className="embla__slide" key={0}>
              <div className="flex items-center justify-center embla__slide__image w-full h-full object-cover aspect-video max-w-full max-h-full bg-gradient-to-br from-purple-100 via-blue-100 to-orange-100 rounded-2xl">
                <CircleX className="size-20 text-muted" />
                <div className="text-center mt-4">
                  <p>No images or videos uploaded yet.</p>
                  <p>Click on the plus icon below to add one.</p>
                  <p>The optimal resolution is 1920x1080.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="embla__slide" key={0}>
              <div className="flex items-center justify-center embla__slide__image w-full h-full object-cover aspect-video max-w-full max-h-full bg-gradient-to-br from-purple-100 via-blue-100 to-orange-100 rounded-2xl">
                <CircleX className="size-20 text-muted" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="embla-thumbs">
        <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
          <div className="embla-thumbs__container gap-1">
            {slides
              .filter((slide) =>
                ["carousel_image", "carousel_video_thumbnail"].includes(
                  slide.type
                )
              )
              .map((slide, index) => (
                <Thumb
                  key={index}
                  onClick={() => onThumbClick(index)}
                  selected={index === selectedIndex}
                  id={slide.id}
                />
              ))}
            {edit && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <UploadThumb
                    key={slides.length}
                    selected={slides.length === selectedIndex}
                    onClick={() => setOpen(true)}
                  />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add an image or a video</DialogTitle>
                    <DialogDescription>
                      Select an image or a video to upload. The optimal
                      resolution is 1920x1080.
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
                          `/upload/${gameId}?type=carousel_file&index=${slides.length}`,
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
                            toast.error(
                              response.error || "Failed to upload file"
                            );
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
                          {file.type.startsWith("image/") ? (
                            <Image
                              src={URL.createObjectURL(file)}
                              alt="Selected preview"
                              className="max-h-48 rounded shadow aspect-video object-cover"
                              width={1920}
                              height={1080}
                              loading="lazy"
                              onLoad={(e) =>
                                URL.revokeObjectURL(
                                  (e.target as HTMLImageElement).src
                                )
                              }
                            />
                          ) : (
                            <video
                              className="max-h-48 rounded shadow aspect-video object-cover"
                              width={1920}
                              height={1080}
                              controls
                              // Important: revoke after metadata loads
                              onLoadedMetadata={(e) =>
                                URL.revokeObjectURL(
                                  (e.target as HTMLVideoElement).src
                                )
                              }
                              src={URL.createObjectURL(file)}
                            />
                          )}
                        </div>
                      )}

                      <Input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => {
                          setFile(e.target.files?.[0] || null);
                        }}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
