import { Web3Storage } from "web3.storage";

const storageClient = async () => {
  return new Web3Storage({
    token: process.env.NEXT_PUBLIC_WEB3STORAGE_API_KEY!,
  });
};

export const storeFile = async (imgFile: File, imageId: string) => {
  const client = await storageClient();

  const file = new File([imgFile], `${imageId}.jpeg`, { type: "image/jpeg" });
  const cid = await client.put([file]);

  return cid;
};

export const retrieveFile = async (cid: string) => {
  const client = await storageClient();

  const status = await client.status(cid);

  if (status) {
    console.log("status", status);
  }
};
