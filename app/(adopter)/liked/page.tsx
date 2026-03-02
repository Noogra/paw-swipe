import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { LikedPetCard } from "@/components/pets/LikedPetCard";

export default async function LikedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const likedSwipes = await prisma.swipe.findMany({
    where: { userId: user.id, direction: "RIGHT" },
    include: {
      pet: {
        select: {
          name: true,
          type: true,
          breed: true,
          ageMonths: true,
          gender: true,
          photos: true,
          city: true,
          description: true,
          isActive: true,
          shelter: {
            select: {
              name: true,
              phone: true,
              email: true,
              website: true,
              address: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (likedSwipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-center px-6 py-20">
        <div className="text-6xl mb-4">❤️</div>
        <h2 className="text-xl font-bold text-gray-700">No liked pets yet</h2>
        <p className="text-gray-400 mt-2 text-sm">
          Swipe right on pets you&apos;re interested in — they&apos;ll appear here with shelter contact details.
        </p>
        <Link
          href="/feed"
          className="mt-6 inline-block bg-amber-500 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-amber-600 transition-colors"
        >
          Start swiping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Liked Pets</h1>
        <p className="text-sm text-gray-500 mt-1">
          {likedSwipes.length} pet{likedSwipes.length !== 1 ? "s" : ""} · Contact the shelter to start the adoption process
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {likedSwipes.map(({ petId, pet }) => (
          <LikedPetCard key={petId} petId={petId} pet={pet} />
        ))}
      </div>
    </div>
  );
}
