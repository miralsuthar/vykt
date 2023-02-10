import { lexicaFetch } from "@/utils/lexicaHelper";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const data = await lexicaFetch(req.body.prompt, req.body.cursor);
  data.baseURL =
    "https://lexica-serve-encoded-images2.sharif.workers.dev/full_jpg";

  res.status(200).json(data);
};

export default handler;
