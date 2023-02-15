import { useContractRead } from "wagmi";
import VyktABI from "@/contracts/vyktContract.json";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

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
    setImages(data as string[]);
  }, [data, isLoading]);

  return (
    <section className="w-full h-full flex flex-col gap-20 justify-center items-center">
      <h1 className="text-white text-2xl">History</h1>
      <div className="flex justify-center items-center gap-10 flex-wrap">
        {images?.map((image, index) => (
          <img
            key={index}
            src={image}
            className="w-52 h-52 rounded-md"
            alt=""
          />
        ))}
      </div>
    </section>
  );
}
