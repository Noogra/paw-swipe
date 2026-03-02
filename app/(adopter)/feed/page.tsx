import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { SwipeStack } from "@/components/swipe/SwipeStack";
import { FilterPanel } from "@/components/swipe/FilterPanel";
import type { SwipeFilters } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{
    type?: string;
    size?: string;
    gender?: string;
    city?: string;
  }>;
}

export default async function FeedPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get all pet IDs this user has already swiped
  const swipedIds = await prisma.swipe
    .findMany({ where: { userId: user.id }, select: { petId: true } })
    .then((rows) => rows.map((r) => r.petId));

  const filters: SwipeFilters = {
    type: params.type,
    size: params.size,
    gender: params.gender,
    city: params.city,
  };

  // Initial batch of pets
  const pets = await prisma.pet.findMany({
    where: {
      isActive: true,
      ...(swipedIds.length > 0 && { id: { notIn: swipedIds } }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(filters.type && { type: filters.type as any }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(filters.size && { size: filters.size as any }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(filters.gender && { gender: filters.gender as any }),
      ...(filters.city && {
        city: { contains: filters.city, mode: "insensitive" as const },
      }),
    },
    select: {
      id: true,
      name: true,
      type: true,
      breed: true,
      ageMonths: true,
      size: true,
      gender: true,
      description: true,
      photos: true,
      city: true,
      shelter: { select: { name: true, phone: true, email: true } },
    },
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col items-center px-4 py-2 sm:py-4 gap-3 sm:gap-4 flex-1 min-h-0">
      {/* FilterPanel uses useSearchParams — must be in Suspense */}
      <Suspense fallback={<div className="h-10 w-full" />}>
        <FilterPanel activeFilters={filters} />
      </Suspense>

      {/* Swipe stack — key forces full remount on filter change */}
      <SwipeStack
        key={JSON.stringify(filters)}
        initialPets={pets}
        filters={filters}
      />
    </div>
  );
}
