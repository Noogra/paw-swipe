import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/ui/Navbar";
import { ShelterCard } from "@/components/shelters/ShelterCard";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";

export default async function HomePage() {
  const shelters = await prisma.shelter.findMany({
    where: { pets: { some: { isActive: true } } },
    include: {
      _count: { select: { pets: { where: { isActive: true } } } },
      pets: {
        where: { isActive: true },
        take: 1,
        select: { photos: true },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { name: "asc" },
  });

  const [featuredShelter, ...restShelters] = shelters;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-warm)" }}>
      <Navbar />
      <HeroSection />
      <FeaturesSection />

      {/* Shelter bento grid */}
      <main id="shelters" className="max-w-5xl mx-auto px-4 pb-24 pt-16">
        <AnimatedSection>
          <p className="font-mono text-xs tracking-widest text-amber-600 uppercase mb-2">
            // Partner shelters
          </p>
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
            Shelters with pets available
          </h2>
        </AnimatedSection>

        {shelters.length === 0 ? (
          <AnimatedSection>
            <div className="glass rounded-3xl text-center py-20 px-8">
              <div className="text-5xl mb-4">🏠</div>
              <p className="font-serif text-xl font-bold text-gray-700">No shelters yet</p>
              <p className="text-sm text-gray-500 mt-1">Check back soon!</p>
            </div>
          </AnimatedSection>
        ) : shelters.length === 1 ? (
          <AnimatedSection>
            <ShelterCard shelter={featuredShelter} variant="large" />
          </AnimatedSection>
        ) : (
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Large featured card */}
            {featuredShelter && (
              <StaggerItem className="lg:col-span-6">
                <ShelterCard shelter={featuredShelter} variant="large" />
              </StaggerItem>
            )}

            {/* Smaller cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {restShelters.map((shelter) => (
                <StaggerItem key={shelter.id}>
                  <ShelterCard shelter={shelter} variant="small" />
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        )}
      </main>
    </div>
  );
}
