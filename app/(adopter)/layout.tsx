import { Navbar } from "@/components/ui/Navbar";

export default function AdopterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
