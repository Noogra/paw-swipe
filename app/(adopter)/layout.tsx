import { Navbar } from "@/components/ui/Navbar";
import { BottomNav } from "@/components/ui/BottomNav";

export default function AdopterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      {/* pb-16 reserves space above the fixed bottom nav on mobile */}
      <main className="flex-1 flex flex-col pb-16 sm:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
