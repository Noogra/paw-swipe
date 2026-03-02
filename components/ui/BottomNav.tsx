"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/feed", label: "Discover", emoji: "🔍" },
  { href: "/liked", label: "Liked", emoji: "❤️" },
  { href: "/profile", label: "Profile", emoji: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t z-40 flex sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map(({ href, label, emoji }) => (
        <Link
          key={href}
          href={href}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium transition-colors ${
            pathname.startsWith(href) ? "text-amber-600" : "text-gray-400"
          }`}
        >
          <span className="text-xl leading-none">{emoji}</span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
