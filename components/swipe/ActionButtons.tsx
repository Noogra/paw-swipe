"use client";

import { motion } from "framer-motion";

interface Props {
  onNope: () => void;
  onLike: () => void;
  disabled?: boolean;
}

export function ActionButtons({ onNope, onLike, disabled }: Props) {
  return (
    <div className="flex items-center gap-10">
      <div className="flex flex-col items-center gap-1.5">
        <motion.button
          onClick={onNope}
          disabled={disabled}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          className="w-16 h-16 rounded-full text-2xl flex items-center justify-center transition-opacity disabled:opacity-40"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            backdropFilter: "blur(16px) saturate(1.8)",
            WebkitBackdropFilter: "blur(16px) saturate(1.8)",
            border: "1.5px solid rgba(239, 68, 68, 0.35)",
            boxShadow: "0 4px 20px rgba(239,68,68,0.12)",
            color: "#dc2626",
          }}
          aria-label="Pass"
        >
          ✕
        </motion.button>
        <span className="text-xs text-gray-400 font-medium">Pass</span>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <motion.button
          onClick={onLike}
          disabled={disabled}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          className="w-16 h-16 rounded-full text-2xl flex items-center justify-center transition-opacity disabled:opacity-40"
          style={{
            background: "rgba(217, 119, 6, 0.1)",
            backdropFilter: "blur(16px) saturate(1.8)",
            WebkitBackdropFilter: "blur(16px) saturate(1.8)",
            border: "1.5px solid rgba(217, 119, 6, 0.35)",
            boxShadow: "0 4px 20px rgba(217,119,6,0.15)",
          }}
          aria-label="Like"
        >
          ❤️
        </motion.button>
        <span className="text-xs text-gray-400 font-medium">Like</span>
      </div>
    </div>
  );
}
