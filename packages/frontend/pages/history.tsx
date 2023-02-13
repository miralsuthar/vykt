import { useContractRead } from "wagmi";
import VyktABI from "@/contracts/vykt.json";
import { useEffect } from "react";

export default function History() {
  const { data, isError, isLoading } = useContractRead({
    address: "0x4C521043f07be5726b549A5A069BD048f2E333d0",
    abi: VyktABI,
    functionName: "getImageURIs",
    args: ["0x6B6C84503FE808fd91ad5087793038Ef81b37f12"],
  });

  useEffect(() => {
    console.log(data);
  }, [data, isLoading]);

  return (
    <section className="w-full h-full flex justify-center items-center">
      <h1 className="text-white text-2xl">History</h1>
    </section>
  );
}
