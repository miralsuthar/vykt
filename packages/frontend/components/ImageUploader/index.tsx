import { useState, useEffect, useContext } from "react";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";
import { utils } from "ethers";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { storeFile, getImageURI } from "@/utils/web3storageHelpers";
import { ImageContext } from "@/contexts";
import VyktABI from "@/contracts/vyktContract.json";
import { MintingProfileModal, PreviewModal } from "../CustomModal";
import { ImageCropper } from "./ImageCropper";

export function ImageDropper() {
  const [enableCrop, setEnableCrop] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImageSaving, setIsImageSaving] = useState<boolean>(false);
  const [ipfsUri, setIpfsUri] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [isMintingModalOpen, setIsMintingModalOpen] = useState<boolean>(false);

  const { image } = useContext(ImageContext);

  const { config } = usePrepareContractWrite({
    address: VyktABI.address as `0x${string}`,
    abi: VyktABI.abi,
    functionName: "setCurrentImageURI",
    args: [
      ipfsUri,
      {
        gasLimit: 1000000,
        value: utils.parseEther("0.1"),
      },
    ],
  });

  const { data, write, isError, error } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      console.log("success", data);
    },
  });

  const handleSaveVykt = async () => {
    if (image) {
      setIsMintingModalOpen(true);
      setIsImageSaving(true);
      const imageId = uuidv4();
      const ImageFile = await fetch(previewUrl!)
        .then((res) => res.blob())
        .then(
          (data) => new File([data], `${imageId}.jpeg`, { type: "image/jpeg" })
        );
      const ImageUri = await storeFile(ImageFile).then((cid) =>
        getImageURI(cid, imageId)
      );
      setIpfsUri(ImageUri!);
      setIsImageSaving(false);
    }
  };

  useEffect(() => {
    console.log("data hash", data?.hash);
  }, [data?.hash]);

  const mint = async () => {
    if (ipfsUri) {
      write?.();
      setIsImageSaving(isLoading);
    }
    if (isError) {
      console.log(error?.message);
    }
    if (isSuccess) {
      console.log("success");
      console.log("data", data);
    }
  };

  const buttonClass = clsx("px-4 py-2 border-white border-2 rounded-lg");

  return (
    <div className="w-full h-full">
      {previewUrl && (
        <PreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen((prev) => !prev)}
          imageUrl={previewUrl!}
          onClick={() => {
            handleSaveVykt();
            setIsPreviewModalOpen((prev) => !prev);
          }}
        />
      )}
      <MintingProfileModal
        isUploaded={ipfsUri ? true : false}
        isUploading={isImageSaving}
        isMinted={isSuccess}
        isOpen={isMintingModalOpen}
        handleMint={mint}
        onClose={() => setIsMintingModalOpen((prev) => !prev)}
      />

      <ImageCropper
        enableCrop={enableCrop}
        setEnableCrop={setEnableCrop}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
      />

      <div className="flex justify-center items-center gap-10 mt-5">
        <button
          className={`${buttonClass} ${enableCrop && "cursor-not-allowed"}`}
          disabled={enableCrop}
          onClick={() => setIsPreviewModalOpen((prev) => !prev)}
        >
          Preview
        </button>
        <button
          className={`${buttonClass}  ${enableCrop && "cursor-not-allowed"}`}
          onClick={() => {
            handleSaveVykt();
          }}
          disabled={isImageSaving || enableCrop}
        >
          {isImageSaving ? "Processing..." : "Save your Vykt"}
        </button>
      </div>
    </div>
  );
}
