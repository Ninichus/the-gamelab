import Image from "next/image";

export function GameLabIcon(props: React.HTMLAttributes<HTMLImageElement>) {
  return (
    <Image
      src="/icon.png"
      alt="GameLab Icon"
      width={100}
      height={100}
      {...props}
    />
  );
}
