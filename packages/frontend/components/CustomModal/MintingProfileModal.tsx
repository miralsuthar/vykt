import { CustomModal } from "./CustomModal";
import { BiImageAdd, BiUpload, BiLinkAlt } from "react-icons/bi";
import clsx from "clsx";
import Confetti from "react-confetti";
import { useRef } from "react";

type MintingProfileModalType = {
  isOpen: boolean;
  onClose?: () => void;
  isUploaded: boolean;
  isMinted: boolean;
  handleMint: () => void;
  isUploading?: boolean;
};

const iconsWrapper = clsx("flex flex-col justify-center items-center gap-3");

export function MintingProfileModal({
  isOpen,
  onClose,
  isUploaded = false,
  isMinted = false,
  handleMint,
  isUploading = false,
}: MintingProfileModalType) {
  const congratulationDiv = useRef<HTMLDivElement>(null);
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} closeButton={false}>
      {isMinted ? (
        <div
          ref={congratulationDiv}
          className="text-white flex flex-col gap-6 text-3xl px-32 overflow-hidden py-20 font-bold text-center"
        >
          <Confetti
            width={congratulationDiv.current?.clientWidth || 650}
            height={450}
          />
          <p>🎉</p>
          <br />
          <p className="">
            Congratulations!! <br /> Your Vykt has been created
          </p>
          <button
            className="text-white w-max mx-auto text-lg px-3 py-2 rounded-md font-bold bg-gradient-to-t from-[#2931E1] to-[#95BFFF]"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-white text-2xl font-bold">
            Your Vykt is on the way...
          </h1>
          <div className="flex text-white justify-center items-center gap-32 px-40 py-20">
            <div className={iconsWrapper}>
              <BiImageAdd color="#35DAB2" size="2rem" />
              <p className="text-[#35DAB2]">Choose</p>
            </div>
            <div className={iconsWrapper}>
              <BiUpload color={isUploaded ? "#35DAB2" : ""} size="2rem" />
              <p className={`${isUploaded && "text-[#35DAB2]"}`}>Upload</p>
            </div>
            <div className={iconsWrapper}>
              <BiLinkAlt color={isMinted ? "#35DAB2" : ""} size="2rem" />
              <p className={`${isMinted && "text-[#35DAB2]"}`}>Link</p>
            </div>
          </div>
          <p className="text-white">{isUploading && "uploading..."}</p>
          <p className="text-white">{isMinted && "minting...."}</p>
          {isUploaded && (
            <button
              className="text-white px-3 py-2 rounded-md font-bold bg-gradient-to-t from-[#2931E1] to-[#95BFFF]"
              onClick={handleMint}
            >
              Mint your Vykt
            </button>
          )}
        </div>
      )}
    </CustomModal>
  );
}
