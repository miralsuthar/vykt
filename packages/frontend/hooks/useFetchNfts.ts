import { useEffect, useState } from "react";
import axios from "axios";
import { NftResponse } from "@/utils/types";

export function useFetchNfts(address: string) {
  const [data, setData] = useState<NftResponse | null>(null);
  useEffect(() => {
    async function getImages() {
      try {
        const { data: res } = await axios({
          method: "GET",
          url: `/api/fetch-nfts?address=${address}`,
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
  }, [address]);

  return { data };
}
