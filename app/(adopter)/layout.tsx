import { Navbar } from "@/components/ui/Navbar";
import { BottomNav } from "@/components/ui/BottomNav";
import { PageTransition } from "@/components/ui/PageTransition";

export default function AdopterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-warm)" }}>
      <Navbar />
      <PageTransition>
        {/* pb-24 reserves space above the fixed bottom nav on mobile */}
        <main className="flex-1 flex flex-col pb-24 sm:pb-0">{children}</main>
      </PageTransition>
      <BottomNav />
    </div>
  );
}
