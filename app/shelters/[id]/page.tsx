import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/ui/Navbar";
import { ShelterPetCard } from "@/components/shelters/ShelterPetCard";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";

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
    <div className="min-h-screen" style={{ background: "var(--bg-warm)" }}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <AnimatedSection className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            Shelters
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-medium truncate">{shelter.name}</span>
        </AnimatedSection>

        {/* Shelter info card */}
        <AnimatedSection delay={0.05} className="mb-10">
          <div className="glass rounded-3xl p-7">
            <p className="font-mono text-xs tracking-widest text-amber-600 uppercase mb-2">
              // Partner shelter
            </p>
            <h1 className="font-serif text-3xl font-bold text-gray-900">{shelter.name}</h1>
            <p className="text-gray-500 mt-1 text-sm">
              📍 {shelter.address}, {shelter.city}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4">
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
        </AnimatedSection>

        {/* Pets section header */}
        <AnimatedSection delay={0.1} className="flex items-center justify-between mb-6">
          <div>
            <p className="font-mono text-xs tracking-widest text-amber-600 uppercase mb-1">
              // Available pets
            </p>
            <h2 className="font-serif text-2xl font-bold text-gray-900">
              {shelter.pets.length} pet
              {shelter.pets.length !== 1 ? "s" : ""} available
            </h2>
          </div>
          {!isAdopter && !user && (
            <Link
              href="/login"
              className="text-xs text-amber-600 hover:text-amber-700 font-medium"
            >
              Log in to like pets →
            </Link>
          )}
        </AnimatedSection>

        {shelter.pets.length === 0 ? (
          <AnimatedSection>
            <div className="glass rounded-3xl text-center py-16 px-8">
              <div className="text-4xl mb-3">🐾</div>
              <p className="font-serif text-lg font-bold text-gray-600">No pets listed yet</p>
              <p className="text-sm text-gray-400 mt-1">Check back soon!</p>
            </div>
          </AnimatedSection>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shelter.pets.map((pet) => (
              <StaggerItem key={pet.id}>
                <ShelterPetCard
                  pet={pet}
                  isLiked={likedPetIds.includes(pet.id)}
                  isAdopter={isAdopter}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </main>
    </div>
  );
}
