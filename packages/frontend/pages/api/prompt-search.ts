import { lexicaFetch } from "@/utils/lexicaHelper";
import { AxiosError } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const { prompt, cursor } = req.query;

    const data = await lexicaFetch(prompt as string, Number(cursor) as number);
    if (prompt === "") {
      data.baseURL =
        "https://lexica-serve-encoded-images2.sharif.workers.dev/full_jpg";
    } else {
      data.baseURL =
        "https://lexica-serve-encoded-images2.sharif.workers.dev/md";
    }

    res.status(200).json(data);
  } catch (error) {
    if (error instanceof AxiosError) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default handler;
