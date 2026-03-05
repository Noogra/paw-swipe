import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { LikedPetCard } from "@/components/pets/LikedPetCard";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";

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
        <AnimatedSection>
          <div className="glass rounded-3xl px-10 py-14 max-w-sm mx-auto">
            <div className="text-5xl mb-4">❤️</div>
            <h2 className="font-serif text-xl font-bold text-gray-700">No liked pets yet</h2>
            <p className="text-gray-400 mt-2 text-sm leading-relaxed">
              Swipe right on pets you&apos;re interested in — they&apos;ll appear here with shelter contact details.
            </p>
            <Link
              href="/feed"
              className="mt-6 inline-block rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #d97706, #f59e0b)",
                boxShadow: "0 4px 16px rgba(217,119,6,0.25)",
              }}
            >
              Start swiping →
            </Link>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 w-full">
      <AnimatedSection className="mb-8">
        <p className="font-mono text-xs tracking-widest text-amber-600 uppercase mb-1">
          // Your matches
        </p>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Liked Pets</h1>
        <p className="text-sm text-gray-500 mt-1">
          {likedSwipes.length} pet{likedSwipes.length !== 1 ? "s" : ""} · Contact the shelter to start the adoption process
        </p>
      </AnimatedSection>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {likedSwipes.map(({ petId, pet }) => (
          <StaggerItem key={petId}>
            <LikedPetCard petId={petId} pet={pet} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
