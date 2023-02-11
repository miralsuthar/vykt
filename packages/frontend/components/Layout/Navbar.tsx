import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Fasthand } from "@next/font/google";

const fasthand = Fasthand({ weight: "400", subsets: ["latin"] });

export function Navbar() {
  return (
    <div className="w-full fixed top-0 left-0 px-8 flex justify-between text-white bg-gray-800 items-center py-2">
      <div className="flex justify-center items-center gap-16">
        <h1 className={`${fasthand.className} text-[2rem]`}>
          V<span className="text-[1.4rem]">ykt</span>
        </h1>
        <div className="flex justify-center items-center gap-8 text-gray-400">
          <a className="hover:text-white" href="/create">
            create
          </a>
          <a className="hover:text-white" href="/history">
            history
          </a>
        </div>
      </div>

      <ConnectButton />
    </div>
  );
}
