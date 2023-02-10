import { Navbar, ImageDroper, Prompt } from "@/components";

export default function Create() {
  return (
    <div className="h-full w-full">
      <section className="text-white flex pt-20 w-full h-full gap-10">
        <div className="h-4/6 w-4/12">
          <ImageDroper />
        </div>
        <div className="flex-1">
          <Prompt />
        </div>
      </section>
    </div>
  );
}
