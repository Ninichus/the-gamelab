import React from "react";
import { Plus } from "lucide-react";
import Image from "next/image";

type PropType = {
  selected: boolean;
  id: string;
  onClick: () => void;
};

export const Thumb: React.FC<PropType> = (props) => {
  const { selected, id, onClick } = props;

  //TODO: optimize => load small thumbnails
  //TODO fill=true property ?

  return (
    <div
      className={"embla-thumbs__slide".concat(
        selected ? " embla-thumbs__slide--selected" : ""
      )}
    >
      <button
        onClick={onClick}
        type="button"
        className="embla-thumbs__slide__number"
      >
        <Image
          src={`/download/${id}`}
          width={1920}
          height={1080}
          alt={`Thumbnail`}
          className="bg-muted border rounded-xl w-full h-full object-cover aspect-video max-w-full max-h-full block"
        />
      </button>
    </div>
  );
};

export const UploadThumb: React.FC<Omit<PropType, "id">> = (props) => {
  const { selected, onClick } = props;

  return (
    <div
      className={"embla-thumbs__slide".concat(
        selected ? " embla-thumbs__slide--selected" : ""
      )}
    >
      <button
        onClick={onClick}
        type="button"
        className="embla-thumbs__slide__number"
      >
        <Plus className="bg-muted border rounded-xl w-full h-full object-cover aspect-video max-w-full max-h-full block hover:bg-gradient-to-br from-purple-100 via-blue-100 to-orange-100" />
      </button>
    </div>
  );
};
