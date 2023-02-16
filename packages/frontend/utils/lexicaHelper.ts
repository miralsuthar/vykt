import axios from "axios";
import { SearchResponse } from "./types";

export const lexicaFetch = async (
  prompt: string,
  cursor: number,
  relevance: "images" | "prompts" = "images"
): Promise<SearchResponse> => {
  const url = "https://lexica.art/api/infinite-prompts";

  const body = {
    cursor: cursor,
    model: "lexica-aperture-v2",
    searchMode: relevance,
    source: "search",
    text: prompt,
  };

  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(body),
  };

  const { data } = await axios({
    method: "POST",
    url: url,
    ...options,
  });

  return data;
};
