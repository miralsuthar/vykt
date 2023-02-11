import { useState, useEffect } from "react";

import { useFetchImages } from "@/hooks";
import { ImageCard } from "./ImageCard";

export function Prompt() {
  const [prompt, setPrompt] = useState<string>("");
  const [searchParam, setSearchParam] = useState<string>("");
  const [cursor, setCursor] = useState<number>(0);

  const { data } = useFetchImages(searchParam, cursor);
  useEffect(() => {
    console.log("data", data);
  }, [data]);

  return (
    <div className="bg-[#141822] h-full rounded-md p-5 flex flex-col gap-4">
      <h1 className="text-[1.5rem] font-bold">Write your prompt</h1>
      <input
        className="bg-[#202738] px-6 py-4 rounded-md w-full"
        type="text"
        placeholder="Enter a prompt"
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (prompt.length > 0 && e.key === "Enter") {
            setSearchParam(prompt);
          }
        }}
      />
      <div className="grid grid-cols-3 scrollbar scrollbar-track-[#202738] scrollbar-thumb-rounded-full scrollbar-thumb-white  gap-x-2 h-full gap-y-2 overflow-y-scroll">
        {data?.images.map((image) => (
          <ImageCard key={image.id} src={data?.baseURL + "/" + image?.id} />
        ))}
      </div>
    </div>
  );
}
