import { DragEvent, useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import clsx from "clsx";

import getCroppedImg from "@/utils/cropImage";

export function ImageDroper() {
  const [image, setImage] = useState<null | File>(null);
  const [enableCrop, setEnableCrop] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isImageHovered, setIsImageHovered] = useState<boolean>(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleImageInput = (e: any) => {
    const file = e.target.files[0];
    setImage(file);
    file && setPreviewUrl(URL.createObjectURL(file));
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
        className="flex aspect-square bg-transparent border-[5px] border-dotted border-gray-400 text-white rounded-lg relative justify-center items-center overflow-hidden"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        {isImageHovered && previewUrl && !enableCrop && (
          <button
            className="text-white absolute top-2 left-2 z-20"
            onClick={() => setEnableCrop((prev) => !prev)}
          >
            crop
          </button>
        )}
        {isImageHovered && previewUrl && (
          <button className="absolute top-2 left-20 z-20 ">
            <label
              htmlFor="file"
              className="cursor-pointer pointer-events-none"
            >
              upload
            </label>
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
            className="absolute top-2 right-2 z-20 text-white"
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
        <button className={`${buttonClass} bg-purple-800`}>
          Save your Vykt
        </button>
      </div>
    </div>
  );
}
