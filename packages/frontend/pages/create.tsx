import { useState } from "react";
import { ImageDroper, Prompt } from "@/components";
import { ImageContext } from "@/contexts";
import { useAccount } from "wagmi";

export default function Create() {
  const [image, setImage] = useState<File | null>(null);
  const { isConnected } = useAccount();
  return (
    <div className="h-full w-full">
      {isConnected ? (
        <section className="text-white flex pt-20 w-full h-full gap-10">
          <ImageContext.Provider value={{ image, setImage }}>
            <div className="h-4/6 w-4/12">
              <ImageDroper />
            </div>
            <div className="flex-1">
              <Prompt />
            </div>
          </ImageContext.Provider>
        </section>
      ) : (
        <section className="text-white text-[3rem] flex pt-20 w-full h-full justify-center items-center">
          <p>Opps! Is seva ka labh lene ke liye krupya apna batua jode.</p>
        </section>
      )}
    </div>
  );
}
