import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { NftResponse } from "@/utils/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address, page } = req.query;

  const mainnetProvider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_QUICKNODE_MAINNET_HTTP_URL
  );

  try {
    const currentPage: number = page ? parseInt(page as string) : 1;
    const response: NftResponse = await mainnetProvider.send("qn_fetchNFTs", {
      wallet: address,
      omitFields: ["traits", "provenance"],
      page: currentPage,
      perPage: 40,
    } as any);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error! });
  }
};

export default handler;
