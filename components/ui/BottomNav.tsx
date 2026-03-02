"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t z-40 flex sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Link
        href="/feed"
        className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium transition-colors ${
          pathname.startsWith("/feed") ? "text-amber-600" : "text-gray-400"
        }`}
      >
        <span className="text-xl leading-none">🔍</span>
        <span>Discover</span>
      </Link>
      <Link
        href="/liked"
        className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium transition-colors ${
          pathname.startsWith("/liked") ? "text-amber-600" : "text-gray-400"
        }`}
      >
        <span className="text-xl leading-none">❤️</span>
        <span>Liked</span>
      </Link>
    </nav>
  );
}
