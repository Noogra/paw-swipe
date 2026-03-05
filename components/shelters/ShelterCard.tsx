"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  shelter: {
    id: string;
    name: string;
    city: string;
    _count: { pets: number };
    pets: { photos: string[] }[];
  };
  variant?: "large" | "small";
};

export function ShelterCard({ shelter, variant = "small" }: Props) {
  const coverPhoto = shelter.pets[0]?.photos[0] ?? null;

  if (variant === "large") {
    return (
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <Link
          href={`/shelters/${shelter.id}`}
          className="group relative block rounded-3xl overflow-hidden"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}
        >
          <div className="relative h-64">
            {coverPhoto ? (
              <Image
                src={coverPhoto}
                alt={shelter.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-amber-50 text-6xl">
                🏠
              </div>
            )}
            {/* Glass info overlay */}
            <div className="absolute bottom-0 inset-x-0 glass rounded-b-3xl p-4">
              <p className="font-mono text-xs text-amber-600/80 uppercase tracking-widest mb-1">
                Featured shelter
              </p>
              <h3 className="font-serif text-xl font-bold text-gray-900">{shelter.name}</h3>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-600">📍 {shelter.city}</p>
                <p className="text-xs font-semibold text-amber-700 bg-amber-100/80 rounded-full px-2.5 py-0.5">
                  {shelter._count.pets} available
                </p>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
      <Link
        href={`/shelters/${shelter.id}`}
        className="group block glass rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div className="relative h-36 bg-amber-50 overflow-hidden">
          {coverPhoto ? (
            <Image
              src={coverPhoto}
              alt={shelter.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-400"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-4xl text-amber-200">
              🏠
            </div>
          )}
        </div>
        <div className="p-3.5">
          <h3 className="font-bold text-gray-900 text-sm truncate">{shelter.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">📍 {shelter.city}</p>
          <p className="text-xs text-amber-600 font-semibold mt-2">
            {shelter._count.pets} pet{shelter._count.pets !== 1 ? "s" : ""} available →
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
