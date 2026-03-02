"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SwipeCard, type SwipeCardHandle } from "./SwipeCard";
import { ActionButtons } from "./ActionButtons";
import { recordSwipe } from "@/app/actions/swipes";
import type { PetWithShelter, SwipeFilters } from "@/lib/types";

interface Props {
  initialPets: PetWithShelter[];
  filters: SwipeFilters;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center px-6">
      <div className="text-6xl mb-4">🐾</div>
      <h3 className="text-xl font-bold text-gray-700">You&apos;ve seen them all!</h3>
      <p className="text-gray-400 mt-2 text-sm leading-relaxed">
        Check back later for new pets, <br /> or adjust your filters above.
      </p>
    </div>
  );
}

export function SwipeStack({ initialPets, filters }: Props) {
  const [pets, setPets] = useState<PetWithShelter[]>(initialPets);
  // If server returned 0 pets there's nothing to fetch; avoid a pointless round-trip
  const [hasMore, setHasMore] = useState(initialPets.length > 0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Track all IDs we've seen (in stack + swiped) to avoid re-fetching them
  const loadedIdsRef = useRef<Set<string>>(
    new Set(initialPets.map((p) => p.id))
  );

  // Ref to the top card so buttons can trigger programmatic swipes
  const topCardRef = useRef<SwipeCardHandle>(null);

  const handleSwipe = useCallback(
    (petId: string, direction: "LEFT" | "RIGHT") => {
      loadedIdsRef.current.add(petId);
      setPets((prev) => prev.filter((p) => p.id !== petId));
      void recordSwipe(petId, direction);
    },
    []
  );

  // Load more pets from API when stack gets low
  useEffect(() => {
    if (pets.length > 3 || !hasMore || isLoadingMore) return;

    let cancelled = false;
    setIsLoadingMore(true);

    const params = new URLSearchParams();
    if (filters.type) params.set("type", filters.type);
    if (filters.size) params.set("size", filters.size);
    if (filters.gender) params.set("gender", filters.gender);
    if (filters.city) params.set("city", filters.city);
    params.set("exclude", [...loadedIdsRef.current].join(","));

    fetch(`/api/pets?${params}`)
      .then((r) => r.json())
      .then((newPets: PetWithShelter[]) => {
        if (cancelled) return;
        if (newPets.length === 0) {
          setHasMore(false);
        } else {
          newPets.forEach((p) => loadedIdsRef.current.add(p.id));
          setPets((prev) => [...prev, ...newPets]);
        }
      })
      .catch(() => {
        if (!cancelled) setHasMore(false);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingMore(false);
      });

    return () => {
      cancelled = true;
    };
    // filters never change during this component's lifetime (key remount on filter change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pets.length, hasMore, isLoadingMore]);

  if (pets.length === 0) {
    if (isLoadingMore) {
      return (
        <div className="flex flex-col items-center justify-center flex-1 text-center px-6 gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400">Finding more pets…</p>
        </div>
      );
    }
    return <EmptyState />;
  }

  // Render top 3 cards (reversed so the first item renders on top)
  const visiblePets = pets.slice(0, 3);

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 flex-1 w-full min-h-0">
      {/* Card stack — flex-1 fills available space, capped at 500px */}
      <div className="relative w-full max-w-sm flex-1 min-h-0 max-h-[500px]">
        {[...visiblePets].reverse().map((pet, reversedIdx) => {
          const stackIndex = visiblePets.length - 1 - reversedIdx;
          const isTop = stackIndex === 0;

          return (
            <SwipeCard
              key={pet.id}
              ref={isTop ? topCardRef : null}
              pet={pet}
              onSwipe={(dir) => handleSwipe(pet.id, dir)}
              isTop={isTop}
              stackIndex={stackIndex}
            />
          );
        })}


      </div>

      {/* Action buttons */}
      <ActionButtons
        disabled={pets.length === 0}
        onNope={() => topCardRef.current?.triggerSwipe("LEFT")}
        onLike={() => topCardRef.current?.triggerSwipe("RIGHT")}
      />
    </div>
  );
}
