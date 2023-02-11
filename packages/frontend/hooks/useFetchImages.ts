import { useEffect, useState } from "react";
import axios from "axios";
import { SearchResponse } from "@/utils/types";

export function useFetchImages(prompt: string, cursor: number) {
  const [data, setData] = useState<SearchResponse | null>(null);
  useEffect(() => {
    async function getImages() {
      try {
        const { data: res } = await axios({
          method: "POST",
          url: `/api/prompt-search?prompt=${prompt}&cursor=${cursor}`,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setData(res);
      } catch (err) {
        console.error(err);
      }
    }
    getImages();
  }, [prompt]);

  return {
    data,
  };
}
