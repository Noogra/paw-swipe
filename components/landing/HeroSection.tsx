"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.25, 0.4, 0.25, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE },
});

export function HeroSection() {
  return (
    <section
      className="relative py-24 px-4 text-center overflow-hidden"
      style={{ background: "var(--grad-hero)" }}
    >
      {/* Decorative blurred orbs */}
      <div
        aria-hidden
        className="absolute top-0 left-1/4 w-80 h-80 rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #fde68a, transparent 70%)", filter: "blur(48px)" }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #f59e0b, transparent 70%)", filter: "blur(56px)" }}
      />

      <div className="relative max-w-3xl mx-auto">
        {/* Mono tag */}
        <motion.p
          {...fadeUp(0)}
          className="font-mono text-xs tracking-widest text-amber-600 uppercase mb-6 select-none"
        >
          // Find your match
        </motion.p>

        {/* Oversized serif headline */}
        <motion.h1
          {...fadeUp(0.1)}
          className="font-serif text-5xl sm:text-7xl md:text-8xl font-black text-gray-900 leading-none tracking-tight mb-6"
        >
          Meet Your{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #d97706, #f59e0b)" }}
          >
            Perfect
          </span>
          <br />
          Companion
        </motion.h1>

        {/* Subtext */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-gray-500 text-base sm:text-lg max-w-md mx-auto leading-relaxed mb-10"
        >
          Browse adoptable pets from shelters near you. Swipe right on the ones
          you love.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          {...fadeUp(0.3)}
          className="flex items-center justify-center gap-3 flex-wrap mb-12"
        >
          <Link
            href="/feed"
            className="relative overflow-hidden rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)", boxShadow: "0 4px 20px rgba(217,119,6,0.35)" }}
          >
            Start swiping →
          </Link>
          <a
            href="#shelters"
            className="liquid-glass rounded-full px-8 py-3.5 text-sm font-medium text-amber-700 hover:text-amber-800 transition-all hover:scale-105"
          >
            Browse shelters
          </a>
        </motion.div>

        {/* Floating stat chips */}
        <motion.div
          {...fadeUp(0.4)}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          {[
            { value: "2,400+", label: "Pets available" },
            { value: "38", label: "Partner shelters" },
            { value: "100%", label: "Free to use" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="glass-strong rounded-2xl px-5 py-2.5 flex flex-col items-center"
            >
              <span className="font-mono text-lg font-bold text-amber-700">{value}</span>
              <span className="text-xs text-gray-500 font-medium">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
