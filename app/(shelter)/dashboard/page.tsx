import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { PetUploadForm } from "@/components/shelter/PetUploadForm";
import { PetList } from "@/components/shelter/PetList";
import { Separator } from "@/components/ui/separator";

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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{shelter.name}</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          📍 {shelter.city} · {shelter.email}
        </p>
      </div>

      <Separator />

      {/* Upload form */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add a new pet
        </h2>
        <PetUploadForm shelterCity={shelter.city} />
      </section>

      <Separator />

      {/* Pet list */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Your pets{" "}
          <span className="text-gray-400 font-normal text-base">
            ({shelter.pets.length})
          </span>
        </h2>
        <PetList pets={shelter.pets} />
      </section>
    </div>
  );
}
