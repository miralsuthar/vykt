import Image from "next/image";

type ImageCardProps = {
  src: string;
  onClick?: () => void;
  isSelected?: boolean;
};

export function ImageCard({ src, onClick, isSelected }: ImageCardProps) {
  return (
    <div
      onClick={onClick}
      className={`overflow-hidden ${
        isSelected && "border-[5px] border-blue-500"
      }  relative rounded-lg aspect-square h-[15rem] cursor-pointer`}
    >
      {isSelected && (
        <div className="absolute top-0 right-0 z-10 border-t-[3rem] border-l-[3rem] border-t-blue-500 border-l-transparent"></div>
      )}
      {isSelected && (
        <img
          src="/check-mark.png"
          className="absolute -top-1 -right-1 scale-[.45] z-20"
          alt=""
        />
      )}
      <Image
        src={src}
        fill
        sizes="(max-width: 640px) 10vw,
        (max-width: 1200px) 30vw,"
        alt="Lexica image"
        className="object-cover object-center"
      />
    </div>
  );
}
