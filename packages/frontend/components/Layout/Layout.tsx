import { Navbar } from "./Navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-screen h-screen bg-background px-10 pt-16 pb-5">
      <Navbar />
      {children}
    </div>
  );
}
