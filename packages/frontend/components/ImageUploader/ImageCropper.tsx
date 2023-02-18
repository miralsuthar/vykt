import { useContext, useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { FiCrop, FiUpload } from "react-icons/fi";
import getCroppedImg from "@/utils/cropImage";

import { ImageContext } from "@/contexts";

type ImageCropperProps = {
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  enableCrop: boolean;
  setEnableCrop: any;
};
export function ImageCropper({
  previewUrl,
  setPreviewUrl,
  enableCrop,
  setEnableCrop,
}: ImageCropperProps) {
  const { image, setImage } = useContext(ImageContext);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isImageHovered, setIsImageHovered] = useState<boolean>(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files[0];
    setImage!(file!);
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

  return (
    <div
      className={`flex aspect-square bg-transparent ${
        !image
          ? "border-[5px] border-dotted border-gray-400"
          : "shadow-md shadow-gray-900"
      }  text-white rounded-lg relative justify-center items-center overflow-hidden`}
      //@ts-ignore
      onDrop={handleDrop}
      //@ts-ignore
      onDragOver={handleDragOver}
      onMouseEnter={() => setIsImageHovered(true)}
      onMouseLeave={() => setIsImageHovered(false)}
    >
      {isImageHovered && previewUrl && !enableCrop && (
        <button
          className="text-white absolute bottom-2 bg-gray-800 rounded-md p-1 right-5 z-50"
          onClick={() => setEnableCrop((prev: boolean) => !prev)}
        >
          <FiCrop size={"1.4rem"} fontWeight="bold" />
        </button>
      )}
      {isImageHovered && previewUrl && !enableCrop && (
        <button className="absolute bottom-2 right-16 z-50 bg-gray-800 rounded-md p-1 cursor-pointer">
          <FiUpload size={"1.4rem"} fontWeight="bold" />
          <input
            name="file"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            className="opacity-0 absolute w-full h-full top-0 left-0"
            onChange={handleImageInput}
          />
        </button>
      )}
      {!previewUrl && (
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          className="absolute top-0 left-0 h-full w-full opacity-0"
          onChange={handleImageInput}
        />
      )}
      {enableCrop && (
        <button
          className="absolute top-2 right-2 z-10 text-white p-2 rounded-md bg-gray-800"
          onClick={() => {
            setEnableCrop((prev: boolean) => !prev);
            showCroppedImage();
          }}
        >
          Done
        </button>
      )}

      <p className="text-gray-400 text-center">
        write your prompt <br /> or{" "}
        <span className="text-gray-200 underline">click/drag</span> to upload a
        photo
      </p>
      {!enableCrop ? (
        <img
          className=" absolute aspect-square object-cover object-center pointer-events-none"
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
  );
}
