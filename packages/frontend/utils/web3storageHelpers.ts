import { Web3Storage } from "web3.storage";

const storageClient = async () => {
  return new Web3Storage({
    token: process.env.NEXT_PUBLIC_WEB3STORAGE_API_KEY!,
  });
};

export const storeFile = async (imgFile: File) => {
  const client = await storageClient();

  const cid = await client.put([imgFile]);
  return cid;
};

export const retrieveFile = async (cid: string) => {
  const client = await storageClient();

  const status = await client.status(cid);

  if (status) {
    console.log("status", status);
  }
};

export const getImageURI = async (cid: string, imageId: string) => {
  const client = await storageClient();

  const status = await client.status(cid);

  if (status) {
    return `https://${cid}.ipfs.dweb.link/${imageId}.jpeg`;
  }

  return;
};
