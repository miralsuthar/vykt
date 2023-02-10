import axios from "axios";

export const lexicaFetch = async (prompt: string, cursor: number) => {
  const url = "https://lexica.art/api/infinite-prompts";

  const body = {
    cursor: cursor,
    model: "lexica-aperture-v2",
    searchMode: "images",
    source: "search",
    text: prompt,
  };

  const options = {
    data: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  };

  const { data } = await axios({
    method: "POST",
    url,
    ...options,
  });

  console.log(await data.nextCursor);
  console.log(await data.count);

  return data;
};
