import { useContext, useEffect, useRef, useState } from "react";

import { ImageContext } from "@/contexts";
import { useFetchImages, useFetchNfts } from "@/hooks";
import { Major_Mono_Display, Work_Sans } from "@next/font/google";
import clsx from "clsx";
import { useAccount } from "wagmi";
import { NftImageCard } from "./NftImageCard";
import { PromptImageCard } from "./PromptImageCard";

const MajorMonoDisplay = Major_Mono_Display({
  weight: "400",
  subsets: ["latin"],
});

const WorkSans = Work_Sans({
  weight: "500",
  subsets: ["latin"],
});

const promptNavStyles = clsx(`
  ${WorkSans.className} text-[rgba(255, 255, 255, 0.41)],
  text-white z-10 rounded-md px-4 py-2 
  transition-all duration-500 ease-in-out,
`);

export function Prompt() {
  const { address } = useAccount();

  const [prompt, setPrompt] = useState<string>("");
  const [searchParam, setSearchParam] = useState<string>("");
  const [cursor, setCursor] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [tab, setTab] = useState<"prompt" | "nfts">("prompt");

  const menuRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);
  const item1Ref = useRef<HTMLButtonElement>(null);
  const item2Ref = useRef<HTMLButtonElement>(null);

  const { setImage } = useContext(ImageContext);

  const { data: promptData } = useFetchImages(searchParam, cursor);
  const { data: nftData } = useFetchNfts(address as string);

  console.log("nft Data", nftData);

  useEffect(() => {
    hoverRef.current!.style.width = `${item1Ref.current?.offsetWidth}px`;
    hoverRef.current!.style.transform = `translateX(${item1Ref.current?.offsetLeft}px)`;
  }, []);

  return (
    <div className="bg-prompt-bg h-full rounded-md p-5 flex flex-col gap-4">
      <div className="flex justify-center items-center gap-16">
        <div
          ref={menuRef}
          className="flex justify-center items-center relative gap-8 text-gray-400"
        >
          <span
            ref={hoverRef}
            className="absolute top-0 left-0 h-full bg-gray-500 rounded-md opacity-30 transition-all duration-500"
          ></span>

          <button
            className={`${promptNavStyles} ${WorkSans.className}`}
            ref={item1Ref}
            onClick={() => {
              hoverRef.current!.style.width = `${item1Ref.current?.offsetWidth}px`;
              hoverRef.current!.style.transform = `translateX(${item1Ref.current?.offsetLeft}px)`;
              setTab("prompt");
            }}
          >
            🎨 Prompt
          </button>

          <button
            className={`${promptNavStyles} ${WorkSans.className}`}
            ref={item2Ref}
            onClick={() => {
              hoverRef.current!.style.width = `${item2Ref.current?.offsetWidth}px`;
              hoverRef.current!.style.transform = `translateX(${item2Ref.current?.offsetLeft}px)`;
              setTab("nfts");
            }}
          >
            📷 NFTs
          </button>
        </div>
      </div>

      {tab === "prompt" ? (
        <>
          <input
            className="bg-prompt-input px-6 py-4 rounded-md w-full"
            type="text"
            placeholder="✏️Write a prompt to create your Vykt"
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (prompt && prompt.length > 0 && e.key === "Enter") {
                setSearchParam(prompt);
              }
            }}
          />
          <div className="grid grid-cols-3 justify-items-center scrollbar scrollbar-w-2 scrollbar-track-[#202738] scrollbar-thumb-rounded-full scrollbar-thumb-white  gap-x-2 h-full gap-y-2 overflow-y-scroll">
            {promptData &&
              promptData?.images.map((image) => (
                <PromptImageCard
                  isSelected={image.id === selectedImage}
                  onClick={() => {
                    fetch(promptData?.baseURL + "/" + image?.id)
                      .then((res) => res.blob())
                      .then((promptData) =>
                        setImage!(
                          new File([promptData], "image", {
                            type: promptData.type,
                          })
                        )
                      );
                    setSelectedImage(image.id);
                  }}
                  key={image.id}
                  src={promptData?.baseURL + "/" + image?.id}
                />
              ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-3 pt-20 justify-items-center scrollbar scrollbar-w-2 scrollbar-track-[#202738] scrollbar-thumb-rounded-full scrollbar-thumb-white  gap-x-2 h-full gap-y-2 overflow-y-scroll">
          {nftData &&
            nftData?.assets?.map((nft) => {
              const extension = nft?.imageUrl?.split(".")?.pop();
              // exclude videos and gifs
              if (extension === "mp4" || extension === "gif") {
                return;
              }

              if (nft?.imageUrl) {
                return (
                  <NftImageCard
                    src={nft.imageUrl}
                    key={`${nft.name}-${nft.collectionTokenId}`}
                    isSelected={
                      `${nft.name}-${nft.collectionTokenId}` === selectedImage
                    }
                  />
                );
              }
            })}
        </div>
      )}
    </div>
  );
}
