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

type PropType = {
  slides: { id: string; index: number | null }[];
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
            slides.map((slide, index) => (
              <div className="embla__slide" key={index}>
                <Image
                  src={`/download/${slide.id}`}
                  alt={`Carousel ${index}`}
                  width={1920}
                  height={1080}
                />
              </div>
            ))
          ) : (
            <div className="embla__slide" key={0}>
              <div className="embla__slide__number">
                Click on the + below to add a media
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="embla-thumbs">
        <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
          <div className="embla-thumbs__container">
            {slides.map((slide, index) => (
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
                          `/upload/${gameId}?type=carousel_image&index=${slides.length}`,
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
                      <Input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                      <div>
                        <Button type="submit" disabled={!file || isUploading}>
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
