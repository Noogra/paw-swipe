"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const TABS = [
  { href: "/feed", label: "Discover", emoji: "🔍" },
  { href: "/liked", label: "Liked", emoji: "❤️" },
  { href: "/profile", label: "Profile", emoji: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 flex sm:hidden justify-center px-4"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)" }}
    >
      <nav className="liquid-glass rounded-2xl flex w-full max-w-xs overflow-hidden">
        {TABS.map(({ href, label, emoji }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="relative flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-medium transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-amber-100/70 rounded-2xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative text-xl leading-none transition-transform ${isActive ? "scale-110" : "scale-100"}`}>
                {emoji}
              </span>
              <span className={`relative transition-colors ${isActive ? "text-amber-700 font-semibold" : "text-gray-400"}`}>
                {label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute bottom-1.5 w-1 h-1 rounded-full bg-amber-500"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
