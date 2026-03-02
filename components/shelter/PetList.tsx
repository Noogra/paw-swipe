"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { deletePet, togglePetActive } from "@/app/actions/pets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Pet = {
  id: string;
  name: string;
  type: string;
  breed: string | null;
  ageMonths: number;
  photos: string[];
  isActive: boolean;
  city: string;
};

function formatAge(months: number): string {
  if (months < 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem > 0 ? `${years}y ${rem}mo` : `${years}y`;
}

function PetCard({ pet }: { pet: Pet }) {
  const [isPending, startTransition] = useTransition();

  const coverPhoto = pet.photos[0] ?? null;

  return (
    <div className={`bg-white rounded-xl border overflow-hidden transition-opacity ${isPending ? "opacity-50" : ""}`}>
      {/* Photo */}
      <div className="relative h-36 bg-gray-100">
        {coverPhoto ? (
          <Image
            src={coverPhoto}
            alt={pet.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 text-4xl">
            ?
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge
            variant={pet.isActive ? "default" : "secondary"}
            className={`text-xs ${pet.isActive ? "bg-green-500 hover:bg-green-600" : ""}`}
          >
            {pet.isActive ? "Active" : "Hidden"}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <div>
          <p className="font-semibold text-sm text-gray-900">{pet.name}</p>
          <p className="text-xs text-gray-400">
            {pet.type.charAt(0) + pet.type.slice(1).toLowerCase()}
            {pet.breed ? ` · ${pet.breed}` : ""} · {formatAge(pet.ageMonths)}
          </p>
        </div>

        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs h-7"
            disabled={isPending}
            onClick={() =>
              startTransition(() => togglePetActive(pet.id, !pet.isActive))
            }
          >
            {pet.isActive ? "Hide" : "Show"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs h-7 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
            disabled={isPending}
            onClick={() => {
              if (confirm(`Delete ${pet.name}?`)) {
                startTransition(() => deletePet(pet.id));
              }
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PetList({ pets }: { pets: Pet[] }) {
  if (pets.length === 0) {
    return (
      <p className="text-gray-400 text-sm py-4">
        No pets yet. Add your first one above.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
}
