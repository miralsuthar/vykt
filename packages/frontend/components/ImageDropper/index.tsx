import { DragEvent, useState, useCallback, useEffect, useContext } from "react";
import Cropper from "react-easy-crop";
import clsx from "clsx";
import { FiCrop, FiUpload } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import { utils } from "ethers";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { storeFile, getImageURI } from "@/utils/web3storageHelpers";

import getCroppedImg from "@/utils/cropImage";
import { ImageContext } from "@/contexts";
import VykyABI from "@/contracts/vykt.json";

export function ImageDropper() {
  const [enableCrop, setEnableCrop] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isImageHovered, setIsImageHovered] = useState<boolean>(false);
  const [isImageSaving, setIsImageSaving] = useState<boolean>(false);
  const [ipfsUri, setIpfsUri] = useState<string | null>(null);

  const { image, setImage } = useContext(ImageContext);

  const { config } = usePrepareContractWrite({
    address: "0x4C521043f07be5726b549A5A069BD048f2E333d0",
    abi: VykyABI,
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
  });

  const handleSaveVykt = async () => {
    if (image) {
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

  const mint = () => {
    if (ipfsUri) {
      write?.();
      setIsImageSaving(isLoading);
    }
    if (isError) {
      console.log(error?.message);
    }
    if (isSuccess) {
      console.log("success");
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    setImage!(file);
  };

  useEffect(() => {
    if (image) {
      setEnableCrop(true);
      setPreviewUrl(URL.createObjectURL(image!));
    }
  }, [image]);

  const handleImageInput = (e: any) => {
    const file = e.target.files[0];
    setImage!(file);
  };

  const onCropComplete = useCallback(
    (croppedArea: unknown, croppedAreaPixels: unknown) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const showCroppedImage = useCallback(async () => {
    try {
      if (image) {
        const croppedImage = await getCroppedImg(
          URL.createObjectURL(image),
          croppedAreaPixels,
          0
        );
        setPreviewUrl(croppedImage as string);
      }
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels]);

  const buttonClass = clsx("px-4 py-2 border-white border-2 rounded-lg");

  return (
    <div className="w-full h-full">
      <div
        className={`flex aspect-square bg-transparent ${
          !image
            ? "border-[5px] border-dotted border-gray-400"
            : "shadow-md shadow-blue-900"
        }  text-white rounded-lg relative justify-center items-center overflow-hidden`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        {isImageHovered && previewUrl && !enableCrop && (
          <button
            className="text-white absolute bottom-2 bg-gray-800 rounded-md p-1 right-5 z-50"
            onClick={() => setEnableCrop((prev) => !prev)}
          >
            <FiCrop size={"1.4rem"} fontWeight="bold" />
          </button>
        )}
        {isImageHovered && previewUrl && (
          <button className="absolute pointer-events-none bottom-2 right-16 z-50 bg-gray-800 rounded-md p-1 cursor-pointer">
            <FiUpload size={"1.4rem"} fontWeight="bold" />
            <input
              name="file"
              type="file"
              className="opacity-0 absolute w-full h-full top-0 left-0"
              onChange={handleImageInput}
            />
          </button>
        )}
        {!previewUrl && (
          <input
            type="file"
            className="absolute top-0 left-0 h-full w-full opacity-0"
            onChange={handleImageInput}
          />
        )}
        {enableCrop && (
          <button
            className="absolute top-2 right-2 z-50 text-white"
            onClick={async () => {
              setEnableCrop((prev) => !prev);
              showCroppedImage();
            }}
          >
            Done
          </button>
        )}

        <p className="text-gray-400 text-center">
          write your prompt <br /> or{" "}
          <span className="text-gray-200 underline">click/drag</span> to upload
          a photo
        </p>
        {!enableCrop ? (
          <img
            className=" z-10 absolute aspect-square object-cover object-center pointer-events-none"
            src={previewUrl ? previewUrl : undefined}
            alt=""
          />
        ) : (
          <Cropper
            image={image ? URL.createObjectURL(image) : ""}
            crop={crop}
            zoom={zoom}
            aspect={1 / 1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        )}
      </div>
      <div className="flex justify-center items-center gap-10 mt-5">
        <button className={buttonClass}>Preview</button>
        <button
          className={`${buttonClass} bg-blue-600`}
          onClick={() => {
            handleSaveVykt();
          }}
          disabled={isImageSaving}
        >
          {isImageSaving ? "Processing..." : "Save your Vykt"}
        </button>
        <button
          className={`${buttonClass} bg-blue-600`}
          onClick={() => {
            mint();
          }}
        >
          Link to address
        </button>
      </div>
    </div>
  );
}
