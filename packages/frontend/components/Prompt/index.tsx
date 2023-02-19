import { useContext, useEffect, useRef, useState } from "react";

import { ImageContext } from "@/contexts";
import { RiSearch2Line } from "react-icons/ri";
import { useFetchImages, useFetchNfts } from "@/hooks";
import { Work_Sans } from "@next/font/google";
import clsx from "clsx";
import { useAccount } from "wagmi";
import { NftImageCard } from "./NftImageCard";
import { PromptImageCard } from "./PromptImageCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { SearchResponse, Image, NftResponse, NftAsset } from "@/utils/types";
import axios from "axios";

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
  const [promptData, setPromptData] = useState<SearchResponse | null>(null);
  const [promptImages, setPromptImages] = useState<Image[]>([]);
  const [nftPage, setNftPage] = useState<number>(1);

  const [nftData, setNftData] = useState<NftResponse | null>(null);
  const [nftImages, setNftImages] = useState<string[]>([]);

  const menuRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);
  const item1Ref = useRef<HTMLButtonElement>(null);
  const item2Ref = useRef<HTMLButtonElement>(null);

  const { setImage } = useContext(ImageContext);

  function getImages() {
    try {
      axios({
        method: "POST",
        url: `/api/prompt-search?prompt=${searchParam}&cursor=${cursor}`,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        setPromptData(res.data);
        setPromptImages([...promptImages, ...res.data.images]);
        setCursor(res.data.nextCursor);
        console.log("res", res.data.images.length);
      });
    } catch (err) {
      console.error(err);
    }
  }

  function getNfts() {
    try {
      axios({
        method: "GET",
        url: `/api/fetch-nfts?address=${address}&page=${nftPage}`,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        setNftData(res.data);

        const imageUrls = res.data.assets.map((asset: NftAsset) => {
          if (asset.imageUrl) {
            return asset.imageUrl;
          }
        });

        setNftImages([...nftImages, ...imageUrls]);
        if (nftPage < res.data.totalPages) {
          setNftPage(res.data.pageNumber + 1);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getImages();
  }, [searchParam]);

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
              getNfts();
            }}
          >
            📷 NFTs
          </button>
        </div>
      </div>

      {tab === "prompt" ? (
        <>
          <div className="flex bg-prompt-input rounded-md">
            <input
              className="bg-prompt-input px-6 py-4 outline-none rounded-md w-full"
              type="text"
              placeholder="✏️Write a prompt to create your Vykt"
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (prompt && prompt.length > 0 && e.key === "Enter") {
                  setPromptImages([]);
                  setSearchParam(prompt);
                }
              }}
            />
            <button
              className="px-4 bg-prompt-input  rounded-r-md"
              onClick={() => {
                setPromptImages([]);
                setSearchParam(prompt);
              }}
            >
              <RiSearch2Line className="text-white text-2xl" />
            </button>
          </div>

          <div
            id="scrollableDiv"
            className="scrollbar scrollbar-w-2 scrollbar-track-[#202738] scrollbar-thumb-rounded-full scrollbar-thumb-white overflow-y-scroll"
          >
            <InfiniteScroll
              dataLength={promptImages ? promptImages.length! : 0} //This is important field to render the next data
              next={() => {
                getImages();
              }}
              hasMore={true}
              loader={<div></div>}
              scrollableTarget="scrollableDiv"
            >
              <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 justify-items-center gap-x-2 h-full gap-y-2">
                {promptImages.length > 0 &&
                  promptImages.map((image) => (
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
            </InfiniteScroll>
          </div>
        </>
      ) : nftData?.assets.length! > 0 ? (
        <div
          id="scrollableNFTDiv"
          className="scrollbar scrollbar-w-2 scrollbar-track-[#202738] scrollbar-thumb-rounded-full scrollbar-thumb-white  gap-x-2 h-full gap-y-2 overflow-y-scroll"
        >
          <InfiniteScroll
            dataLength={nftImages ? nftImages.length! : 0} //This is important field to render the next data
            next={() => {
              getNfts();
            }}
            hasMore={true}
            loader={<div></div>}
            scrollableTarget="scrollableNFTDiv"
          >
            <div className=" grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 pt-20 justify-items-center gap-y-5">
              {nftImages &&
                nftImages.map((nft, id) => {
                  const extension = nft?.split(".")?.pop();
                  // exclude videos and gifs
                  if (extension === "mp4" || extension === "gif") {
                    return;
                  }

                  return (
                    <NftImageCard
                      onClick={() => {
                        fetch(nft)
                          .then((res) => res.blob())
                          .then((nftData) =>
                            setImage!(
                              new File([nftData], "image", {
                                type: nftData.type,
                              })
                            )
                          )
                          .catch((err) => {
                            return;
                          });
                        setSelectedImage(String(id));
                      }}
                      src={nft}
                      key={id}
                      isSelected={String(id) === selectedImage}
                    />
                  );
                })}
            </div>
          </InfiniteScroll>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full ">
          <p className="text-white text-2xl -mt-60">No NFTs found</p>
        </div>
      )}
    </div>
  );
}
