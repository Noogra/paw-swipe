import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { PetUploadForm } from "@/components/shelter/PetUploadForm";
import { PetList } from "@/components/shelter/PetList";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const shelter = await prisma.shelter.findUnique({
    where: { userId: user.id },
    include: {
      pets: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!shelter) redirect("/login");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8" style={{ background: "var(--bg-warm)" }}>
      {/* Header */}
      <AnimatedSection>
        <p className="font-mono text-xs tracking-widest text-amber-600 uppercase mb-1">
          // Shelter dashboard
        </p>
        <h1 className="font-serif text-3xl font-bold text-gray-900">{shelter.name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          📍 {shelter.city} · {shelter.email}
        </p>
      </AnimatedSection>

      <div className="h-px" style={{ background: "rgba(217,119,6,0.15)" }} />

      {/* Upload form */}
      <AnimatedSection delay={0.1}>
        <section className="glass rounded-3xl p-6">
          <p className="font-mono text-xs tracking-widest text-amber-600 uppercase mb-4">
            // Add a new pet
          </p>
          <PetUploadForm shelterCity={shelter.city} />
        </section>
      </AnimatedSection>

      <div className="h-px" style={{ background: "rgba(217,119,6,0.15)" }} />

      {/* Pet list */}
      <AnimatedSection delay={0.15}>
        <section>
          <p className="font-mono text-xs tracking-widest text-amber-600 uppercase mb-1">
            // Your listings
          </p>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-5">
            Your pets{" "}
            <span className="text-gray-400 font-normal text-lg">
              ({shelter.pets.length})
            </span>
          </h2>
          <PetList pets={shelter.pets} />
        </section>
      </AnimatedSection>
    </div>
  );
}
