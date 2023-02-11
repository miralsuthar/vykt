import Image from "next/image";

type ImageCardProps = {
  src: string;
};

export function ImageCard({ src }: ImageCardProps) {
  return (
    <div className="overflow-hidden rounded-lg aspect-square h-max w-max">
      <Image src={src} width="300" height="100" alt="Lexica image" />
    </div>
  );
}
