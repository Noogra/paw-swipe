"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import type { PanInfo } from "framer-motion";
import type { PetWithShelter } from "@/lib/types";

const SWIPE_THRESHOLD = 80;
const VELOCITY_THRESHOLD = 500;
const FLY_DISTANCE = 700;

function formatAge(months: number): string {
  if (months < 12) return `${months}mo`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m > 0 ? `${y}y ${m}mo` : `${y}y`;
}

export interface SwipeCardHandle {
  triggerSwipe: (direction: "LEFT" | "RIGHT") => void;
}

interface Props {
  pet: PetWithShelter;
  onSwipe: (direction: "LEFT" | "RIGHT") => void;
  isTop: boolean;
  stackIndex: number; // 0 = top, 1 = second, 2 = third
}

export const SwipeCard = forwardRef<SwipeCardHandle, Props>(
  ({ pet, onSwipe, isTop, stackIndex }, ref) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-18, 18]);
    const likeOpacity = useTransform(x, [20, 80], [0, 1]);
    const nopeOpacity = useTransform(x, [-80, -20], [1, 0]);
    const isSwiping = useRef(false);

    const scale = 1 - stackIndex * 0.04;
    const yOffset = stackIndex * 12;

    async function flyOff(direction: "LEFT" | "RIGHT") {
      if (isSwiping.current) return;
      isSwiping.current = true;
      await animate(x, direction === "RIGHT" ? FLY_DISTANCE : -FLY_DISTANCE, {
        duration: 0.28,
        ease: "easeOut",
      });
      onSwipe(direction);
    }

    useImperativeHandle(ref, () => ({ triggerSwipe: flyOff }));

    async function handleDragEnd(_: unknown, info: PanInfo) {
      const right =
        info.offset.x > SWIPE_THRESHOLD ||
        info.velocity.x > VELOCITY_THRESHOLD;
      const left =
        info.offset.x < -SWIPE_THRESHOLD ||
        info.velocity.x < -VELOCITY_THRESHOLD;

      if (right) {
        await flyOff("RIGHT");
      } else if (left) {
        await flyOff("LEFT");
      } else {
        animate(x, 0, { type: "spring", stiffness: 300, damping: 25 });
      }
    }

    const photo = pet.photos[0];

    return (
      <motion.div
        className="absolute inset-0 rounded-3xl overflow-hidden select-none"
        style={{
          x: isTop ? x : 0,
          rotate: isTop ? rotate : 0,
          scale,
          y: -yOffset,
          zIndex: 10 - stackIndex,
          cursor: isTop ? "grab" : "default",
          boxShadow: "0 24px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1)",
        }}
        whileTap={isTop ? { cursor: "grabbing" } : undefined}
        drag={isTop ? "x" : false}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
      >
        {/* Background photo */}
        {photo ? (
          <Image
            src={photo}
            alt={pet.name}
            fill
            className="object-cover pointer-events-none"
            sizes="(max-width: 640px) 100vw, 400px"
            priority={isTop}
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-8xl"
            style={{ background: "var(--grad-hero)" }}>
            🐾
          </div>
        )}

        {/* LIKE / NOPE overlays — only on top card */}
        {isTop && (
          <>
            <motion.div
              className="absolute top-10 left-5 font-black text-lg px-4 py-1.5 rounded-full -rotate-12 border-2"
              style={{
                opacity: likeOpacity,
                background: "rgba(217, 119, 6, 0.18)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderColor: "rgba(217, 119, 6, 0.7)",
                color: "#92400e",
              }}
            >
              LIKE ❤️
            </motion.div>
            <motion.div
              className="absolute top-10 right-5 font-black text-lg px-4 py-1.5 rounded-full rotate-12 border-2"
              style={{
                opacity: nopeOpacity,
                background: "rgba(239, 68, 68, 0.18)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderColor: "rgba(239, 68, 68, 0.7)",
                color: "#991b1b",
              }}
            >
              NOPE ✕
            </motion.div>
          </>
        )}

        {/* Soft gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-52 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)" }}
        />

        {/* Glass info panel */}
        <div
          className="absolute inset-x-3 bottom-3 p-4 rounded-2xl pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.14)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          <div className="flex items-baseline gap-2 flex-wrap">
            <h2 className="text-2xl font-bold text-white leading-tight">{pet.name}</h2>
            <span className="font-mono text-sm text-white/80">
              {formatAge(pet.ageMonths)}
            </span>
            <span className="text-sm text-white/65 capitalize">
              · {pet.gender.toLowerCase()}
            </span>
          </div>

          {pet.breed && (
            <p className="text-sm text-white/75 mt-0.5">{pet.breed}</p>
          )}

          <p className="text-sm text-white/65 mt-1.5">
            📍 {pet.city} · 🏠 {pet.shelter.name}
          </p>

          {pet.description && (
            <p className="text-xs text-white/55 mt-2 line-clamp-2 leading-relaxed">
              {pet.description}
            </p>
          )}
        </div>
      </motion.div>
    );
  }
);

SwipeCard.displayName = "SwipeCard";
