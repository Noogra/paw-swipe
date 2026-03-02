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
        className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl select-none"
        style={{
          x: isTop ? x : 0,
          rotate: isTop ? rotate : 0,
          scale,
          y: -yOffset,
          zIndex: 10 - stackIndex,
          cursor: isTop ? "grab" : "default",
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
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center text-8xl">
            🐾
          </div>
        )}

        {/* LIKE / NOPE overlays — only on top card */}
        {isTop && (
          <>
            <motion.div
              className="absolute top-10 left-5 bg-green-500 text-white font-black text-xl px-4 py-1.5 rounded-xl border-[3px] border-green-600 -rotate-12"
              style={{ opacity: likeOpacity }}
            >
              LIKE ❤️
            </motion.div>
            <motion.div
              className="absolute top-10 right-5 bg-red-500 text-white font-black text-xl px-4 py-1.5 rounded-xl border-[3px] border-red-600 rotate-12"
              style={{ opacity: nopeOpacity }}
            >
              NOPE ✕
            </motion.div>
          </>
        )}

        {/* Bottom gradient + info */}
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none" />

        <div className="absolute inset-x-0 bottom-0 p-5 text-white pointer-events-none">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h2 className="text-2xl font-bold leading-tight">{pet.name}</h2>
            <span className="text-base font-medium opacity-90">
              {formatAge(pet.ageMonths)}
            </span>
            <span className="text-sm opacity-75 capitalize">
              · {pet.gender.toLowerCase()}
            </span>
          </div>

          {pet.breed && (
            <p className="text-sm opacity-80 mt-0.5">{pet.breed}</p>
          )}

          <p className="text-sm opacity-70 mt-1.5">
            📍 {pet.city} · 🏠 {pet.shelter.name}
          </p>

          {pet.description && (
            <p className="text-xs opacity-65 mt-2 line-clamp-2 leading-relaxed">
              {pet.description}
            </p>
          )}
        </div>
      </motion.div>
    );
  }
);

SwipeCard.displayName = "SwipeCard";
