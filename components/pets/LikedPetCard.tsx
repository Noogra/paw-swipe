"use client";

import { useTransition } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { removeSwipe } from "@/app/actions/swipes";

type LikedPet = {
  petId: string;
  pet: {
    name: string;
    type: string;
    breed: string | null;
    ageMonths: number;
    gender: string;
    photos: string[];
    city: string;
    description: string;
    shelter: {
      name: string;
      phone: string;
      email: string;
      website: string | null;
      address: string;
    };
  };
};

function formatAge(months: number): string {
  if (months < 12) return `${months} months`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m > 0 ? `${y}y ${m}mo` : `${y} year${y !== 1 ? "s" : ""}`;
}

export function LikedPetCard({ petId, pet }: LikedPet) {
  const [isPending, startTransition] = useTransition();
  const photo = pet.photos[0] ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: isPending ? 0.4 : 1 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`glass rounded-3xl overflow-hidden transition-shadow hover:shadow-lg ${isPending ? "pointer-events-none" : ""}`}
    >
      {/* Photo */}
      <div className="relative h-48 bg-amber-50 overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={pet.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-5xl text-amber-200">
            🐾
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Pet info */}
        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="font-serif font-bold text-gray-900 text-lg">{pet.name}</h3>
            <span className="font-mono text-xs text-gray-500">{formatAge(pet.ageMonths)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {pet.type.charAt(0) + pet.type.slice(1).toLowerCase()}
            {pet.breed ? ` · ${pet.breed}` : ""} ·{" "}
            {pet.gender.charAt(0) + pet.gender.slice(1).toLowerCase()}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">📍 {pet.city}</p>
        </div>

        {/* Description */}
        {pet.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {pet.description}
          </p>
        )}

        {/* Shelter contact — liquid glass */}
        <div className="liquid-glass rounded-2xl p-3 space-y-1.5">
          <p className="text-xs font-semibold text-amber-800">
            🏠 {pet.shelter.name}
          </p>
          <a
            href={`tel:${pet.shelter.phone}`}
            className="flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-900 transition-colors"
          >
            📞 {pet.shelter.phone}
          </a>
          <a
            href={`mailto:${pet.shelter.email}`}
            className="flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-900 transition-colors break-all"
          >
            ✉️ {pet.shelter.email}
          </a>
          {pet.shelter.website && (
            <a
              href={pet.shelter.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-900 transition-colors"
            >
              🌐 Website
            </a>
          )}
          <p className="text-xs text-amber-600 mt-0.5">📌 {pet.shelter.address}</p>
        </div>

        {/* Remove button */}
        <button
          onClick={() => startTransition(() => removeSwipe(petId))}
          className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors py-1"
        >
          Remove from liked ×
        </button>
      </div>
    </motion.div>
  );
}
