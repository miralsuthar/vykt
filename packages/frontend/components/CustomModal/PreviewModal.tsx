import clsx from "clsx";
import { CustomModal } from "./CustomModal";
import { useAccount } from "wagmi";

type PreviewModalType = {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onClick: () => void;
};

const buttonClass = clsx("px-4 py-2 border-white border-2 rounded-lg");

export function PreviewModal({
  isOpen,
  onClose,
  imageUrl,
  onClick,
}: PreviewModalType) {
  const { address } = useAccount();

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} closeButton={true}>
      <div className="flex px-20 flex-col justify-center items-center gap-10">
        <h1 className="text-white text-3xl font-bold text-center">
          Here's a sneak peak of <br /> your Vykt
        </h1>
        <div className="px-4 pl-9 pr-20 py-6 flex justify-center items-center gap-8 rounded-md bg-[#141822] ">
          <div className="w-20 h-20 rounded-full overflow-hidden ">
            <img className="w-full h-full object-cover" src={imageUrl} alt="" />
          </div>
          <div className="text-white">
            <p className="text-xl font-bold">{`${address?.slice(
              0,
              3
            )}...${address?.slice(-4, -1)}`}</p>
            <p className="text-md text-gray-500">{`${address?.slice(
              0,
              3
            )}...${address?.slice(-4, -1)}`}</p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-5">
          <p className="text-[#9AA5BE] text-center">
            want this to be your Vykt ?
          </p>
          <button
            className={`${buttonClass} bg-gradient-to-t from-[#2931E1] to-[#95BFFF] text-white`}
            onClick={onClick}
          >
            Save your Vykt
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
