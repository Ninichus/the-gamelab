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
        <Plus />
      </button>
    </div>
  );
};
