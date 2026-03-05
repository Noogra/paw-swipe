"use client";

import { motion } from "framer-motion";

const FEATURES = [
  {
    number: "01",
    label: "DISCOVER",
    title: "Swipe Through Pets",
    description:
      "Browse adoptable animals with a simple swipe. Like the ones you love, skip the ones you don't — no commitment required.",
    emoji: "🔍",
    span: "lg:col-span-5",
  },
  {
    number: "02",
    label: "MATCH",
    title: "Get Matched",
    description:
      "When you like a pet, we connect you directly with their shelter so you can learn more and schedule a visit.",
    emoji: "❤️",
    span: "lg:col-span-4",
  },
  {
    number: "03",
    label: "ADOPT",
    title: "Change a Life",
    description:
      "Give a rescued animal a forever home. Every swipe matters.",
    emoji: "🏡",
    span: "lg:col-span-3",
  },
];

export function FeaturesSection() {
  return (
    <section
      className="py-20 px-4"
      style={{ background: "var(--grad-section)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="font-mono text-xs tracking-widest text-amber-600 uppercase mb-2">
            // How it works
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
            Three steps to find your match
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {FEATURES.map(({ number, label, title, description, emoji, span }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.25, 0.4, 0.25, 1] as const }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className={`liquid-glass rounded-3xl p-7 flex flex-col gap-4 cursor-default ${span}`}
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs text-amber-600/70 tracking-widest">
                  {number} / {label}
                </span>
                <span className="text-3xl">{emoji}</span>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
