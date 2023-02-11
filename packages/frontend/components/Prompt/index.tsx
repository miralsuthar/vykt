import { useState, useEffect } from "react";

export function Prompt() {
  const [input, setInput] = useState<string>("");

  return (
    <div className="bg-[#141822] rounded-md p-5 flex flex-col gap-4">
      <h1 className="text-[1.5rem] font-bold">Write your prompt</h1>
      <input
        className="bg-[#202738] px-6 py-4 rounded-md w-full"
        type="text"
        placeholder="Enter a prompt"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (input.length > 0 && e.key === "Enter") {
            console.log(input);
          }
        }}
      />
      <div></div>
    </div>
  );
}
