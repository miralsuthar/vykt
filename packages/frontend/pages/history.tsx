import { useContractRead } from "wagmi";
import VyktABI from "@/contracts/vyktContract.json";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Unna } from "@next/font/google";

const unna = Unna({
  weight: "400",
  subsets: ["latin"],
});

export default function History() {
  const { address } = useAccount();
  const [images, setImages] = useState<string[]>();

  const { data, isError, isLoading } = useContractRead({
    address: VyktABI.address as `0x${string}`,
    abi: VyktABI.abi,
    functionName: "getImageURIs",
    args: [address],
  });

  useEffect(() => {
    setImages([...(data as string[])].reverse());
  }, [data, isLoading]);

  return (
    <section className="w-full h-full flex flex-col gap-20 justify-start items-center">
      <h1 className={`${unna.className} text-white text-[4rem]`}>History</h1>
      <div className="flex justify-center items-center gap-10 flex-wrap">
        {images && images.length > 0 ? (
          images?.map((image, index) => (
            <img
              key={index}
              src={image}
              className="w-52 h-52 rounded-md"
              alt=""
            />
          ))
        ) : (
          <p className="text-center text-gray-500 -mt-5">
            You don't have any history, create your vykt to make history.
          </p>
        )}
      </div>
    </section>
  );
}
