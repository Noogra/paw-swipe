import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/ui/Navbar";
import { ShelterPetCard } from "@/components/shelters/ShelterPetCard";

export default async function ShelterProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdopter = user?.user_metadata?.role === "ADOPTER";

  const shelter = await prisma.shelter.findUnique({
    where: { id },
    include: {
      pets: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!shelter) notFound();

  // Fetch which pets this adopter has already liked
  let likedPetIds: string[] = [];
  if (isAdopter && user) {
    const liked = await prisma.swipe.findMany({
      where: {
        userId: user.id,
        direction: "RIGHT",
        petId: { in: shelter.pets.map((p) => p.id) },
      },
      select: { petId: true },
    });
    likedPetIds = liked.map((s) => s.petId);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            Shelters
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-medium truncate">{shelter.name}</span>
        </div>
        {/* Shelter info card */}
        <div className="bg-white rounded-2xl border p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{shelter.name}</h1>
          <p className="text-gray-500 mt-1 text-sm">
            📍 {shelter.address}, {shelter.city}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
            <a
              href={`tel:${shelter.phone}`}
              className="text-sm text-amber-700 hover:text-amber-900 transition-colors"
            >
              📞 {shelter.phone}
            </a>
            <a
              href={`mailto:${shelter.email}`}
              className="text-sm text-amber-700 hover:text-amber-900 transition-colors"
            >
              ✉️ {shelter.email}
            </a>
            {shelter.website && (
              <a
                href={shelter.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-amber-700 hover:text-amber-900 transition-colors"
              >
                🌐 Website
              </a>
            )}
          </div>
        </div>

        {/* Pets section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {shelter.pets.length} pet
            {shelter.pets.length !== 1 ? "s" : ""} available
          </h2>
          {!isAdopter && !user && (
            <Link
              href="/login"
              className="text-xs text-amber-600 hover:text-amber-700 font-medium"
            >
              Log in to like pets →
            </Link>
          )}
        </div>

        {shelter.pets.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-2">🐾</div>
            <p>No pets listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shelter.pets.map((pet) => (
              <ShelterPetCard
                key={pet.id}
                pet={pet}
                isLiked={likedPetIds.includes(pet.id)}
                isAdopter={isAdopter}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
