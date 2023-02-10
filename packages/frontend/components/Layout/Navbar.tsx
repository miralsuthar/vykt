import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Major_Mono_Display, Work_Sans } from "@next/font/google";
import clsx from "clsx";
import Link from "next/link";

const MajorMonoDisplay = Major_Mono_Display({
  weight: "400",
  subsets: ["latin"],
});

const WorkSans = Work_Sans({
  weight: "500",
  subsets: ["latin"],
});

const navButtonStyles = clsx(`
  ${WorkSans.className} text-[rgba(255, 255, 255, 0.41)],
  hover:text-white hover:bg-gray-700 rounded-md px-4 py-2 
  transition-all duration-500 ease-in-out
`);

export function Navbar() {
  return (
    <div className="w-full fixed top-0 left-0 px-8 flex justify-between text-white bg-gray-800 items-center py-2">
      <div className="flex justify-center items-center gap-16">
        <Link href="/" className={`${MajorMonoDisplay.className} text-[2rem]`}>
          Vykt
        </Link>
        <div className="flex justify-center items-center gap-8 text-gray-400">
          <Link
            className={`${navButtonStyles} ${WorkSans.className}`}
            href="/create"
          >
            ✏️ Create
          </Link>
          <Link
            className={`${navButtonStyles} ${WorkSans.className}`}
            href="/history"
          >
            🕓 History
          </Link>
        </div>
      </div>

      <ConnectButton />
    </div>
  );
}
