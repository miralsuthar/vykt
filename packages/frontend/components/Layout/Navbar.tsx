import { Major_Mono_Display, Work_Sans } from "@next/font/google";
import clsx from "clsx";
import Link from "next/link";
import { useRef, useEffect } from "react";
import { useRouter } from "next/router";

import { CustomConnectButton } from "@/components";

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
  text-white z-10 rounded-md px-4 py-2 
  transition-all duration-500 ease-in-out,
`);

export function Navbar() {
  const router = useRouter();

  const menuRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);
  const item1Ref = useRef<HTMLAnchorElement>(null);
  const item2Ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (router.route === "/") {
      hoverRef.current!.style.width = `0px`;
      hoverRef.current!.style.transform = `translateX(0px)`;
    } else if (router.route === "/create") {
      hoverRef.current!.style.width = `${item1Ref.current?.offsetWidth}px`;
      hoverRef.current!.style.transform = `translateX(${item1Ref.current?.offsetLeft}px)`;
    } else if (router.route === "/history") {
      hoverRef.current!.style.width = `${item2Ref.current?.offsetWidth}px`;
      hoverRef.current!.style.transform = `translateX(${item2Ref.current?.offsetLeft}px)`;
    }
  }, [router.route]);

  return (
    <div className="w-full fixed top-0 left-0 px-8 flex justify-between text-white bg-navbar items-center py-2">
      <div className="flex justify-center items-center gap-16">
        <Link href="/" className={`${MajorMonoDisplay.className} text-[2rem]`}>
          Vykt
        </Link>
        <div
          ref={menuRef}
          className="flex justify-center items-center relative gap-8 text-gray-400"
        >
          <span
            ref={hoverRef}
            className="absolute top-0 left-0 h-full bg-gray-500 rounded-md opacity-30 transition-all duration-500"
          ></span>
          <Link
            ref={item1Ref}
            className={`${navButtonStyles} ${WorkSans.className}`}
            href="/create"
            onClick={() => {
              hoverRef.current!.style.width = `${item1Ref.current?.offsetWidth}px`;
              hoverRef.current!.style.transform = `translateX(${item1Ref.current?.offsetLeft}px)`;
            }}
          >
            ✏️ Create
          </Link>
          <Link
            ref={item2Ref}
            className={`${navButtonStyles} ${WorkSans.className}`}
            href="/history"
            onClick={() => {
              hoverRef.current!.style.width = `${item2Ref.current?.offsetWidth}px`;
              hoverRef.current!.style.transform = `translateX(${item2Ref.current?.offsetLeft}px)`;
            }}
          >
            🕓 History
          </Link>
        </div>
      </div>

      <CustomConnectButton />
    </div>
  );
}
