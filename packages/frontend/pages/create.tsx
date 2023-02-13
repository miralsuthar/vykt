import { useState } from "react";
import { ImageDropper, Prompt } from "@/components";
import { ImageContext } from "@/contexts";
import { useAccount } from "wagmi";
import { Unna } from "@next/font/google";

const unna = Unna({
  weight: "400",
  subsets: ["latin"],
});

export default function Create() {
  const [image, setImage] = useState<File | null>(null);
  const { isConnected } = useAccount();

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {isConnected && (
        <div className="mb-10">
          <h1
            className={`${unna.className} text-[4rem] text-white text-center `}
          >
            Create
          </h1>
          <p className="text-center text-gray-500 -mt-2">
            A unique profile photo for your unique address.
          </p>
        </div>
      )}

      {isConnected ? (
        <section className="text-white flex justify-center items-start w-full h-3/5 gap-10 flex-1">
          <ImageContext.Provider value={{ image, setImage }}>
            <div className="w-2/6">
              <ImageDropper />
            </div>
            <div className="w-4/6 h-full">
              <Prompt />
            </div>
          </ImageContext.Provider>
        </section>
      ) : (
        <section className="text-white text-[3rem] flex h-full justify-center items-center">
          <p>Opps! Is seva ka labh lene ke liye krupya apna batua jode.</p>
        </section>
      )}
    </div>
  );
}
