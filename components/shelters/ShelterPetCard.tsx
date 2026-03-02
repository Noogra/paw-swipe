"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { recordSwipe, removeSwipe } from "@/app/actions/swipes";

type Pet = {
  id: string;
  name: string;
  type: string;
  breed: string | null;
  ageMonths: number;
  gender: string;
  size: string;
  photos: string[];
  city: string;
  description: string;
};

type Props = {
  pet: Pet;
  isLiked: boolean;
  isAdopter: boolean;
};

function formatAge(months: number): string {
  if (months < 12) return `${months}mo`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m > 0 ? `${y}y ${m}mo` : `${y}y`;
}

export function ShelterPetCard({ pet, isLiked: initialLiked, isAdopter }: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const photo = pet.photos[0] ?? null;

  function toggleLike() {
    if (!isAdopter) {
      router.push("/login");
      return;
    }
    const next = !liked;
    setLiked(next); // optimistic
    startTransition(async () => {
      if (next) {
        await recordSwipe(pet.id, "RIGHT");
      } else {
        await removeSwipe(pet.id);
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
      {/* Photo */}
      <div className="relative h-52 bg-gray-100">
        {photo ? (
          <Image
            src={photo}
            alt={pet.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-5xl text-gray-200">
            🐾
          </div>
        )}

        {/* Like button */}
        <button
          onClick={toggleLike}
          disabled={isPending}
          title={isAdopter ? (liked ? "Unlike" : "Like") : "Log in to like"}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all text-base
            ${liked
              ? "bg-red-500 text-white scale-110"
              : "bg-white text-gray-300 hover:text-red-400 hover:scale-105"
            }
            ${isPending ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          {liked ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-bold text-gray-900">{pet.name}</h3>
          <span className="text-xs text-gray-400 flex-shrink-0">
            {formatAge(pet.ageMonths)}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-0.5">
          {pet.type.charAt(0) + pet.type.slice(1).toLowerCase()}
          {pet.breed ? ` · ${pet.breed}` : ""} ·{" "}
          {pet.gender.charAt(0) + pet.gender.slice(1).toLowerCase()}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">📍 {pet.city}</p>
        {pet.description && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {pet.description}
          </p>
        )}
      </div>
    </div>
  );
}
