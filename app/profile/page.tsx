import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/ui/Navbar";
import { BottomNav } from "@/components/ui/BottomNav";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const role = (user.user_metadata?.role as "ADOPTER" | "SHELTER") ?? "ADOPTER";
  const isAdopter = role === "ADOPTER";

  // Fetch DB user for member-since date
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { createdAt: true },
  });

  const memberSince = dbUser?.createdAt
    ? new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
        new Date(dbUser.createdAt)
      )
    : null;

  // Adopter: liked count
  let likedCount = 0;
  if (isAdopter) {
    likedCount = await prisma.swipe.count({
      where: { userId: user.id, direction: "RIGHT" },
    });
  }

  // Shelter: shelter details
  const shelter = !isAdopter
    ? await prisma.shelter.findUnique({ where: { userId: user.id } })
    : null;

  const email = user.email ?? "";
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main
        className={`max-w-xl mx-auto px-4 py-8 space-y-4 ${
          isAdopter ? "pb-24 sm:pb-10" : "pb-10"
        }`}
      >
        {/* Identity card */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl font-bold text-amber-700 flex-shrink-0 select-none">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full">
                {isAdopter ? "🐾 Adopter" : "🏠 Shelter"}
              </span>
              {memberSince && (
                <span className="text-xs text-gray-400">Since {memberSince}</span>
              )}
            </div>
          </div>
        </div>

        {/* Adopter stats */}
        {isAdopter && (
          <div className="bg-white rounded-2xl border shadow-sm p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Activity
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-xl flex-shrink-0">
                ❤️
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 leading-none">
                  {likedCount}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  liked pet{likedCount !== 1 ? "s" : ""}
                </p>
              </div>
              {likedCount > 0 && (
                <Link
                  href="/liked"
                  className="ml-auto text-xs text-amber-600 font-medium hover:underline"
                >
                  View all →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Shelter info */}
        {shelter && (
          <div className="bg-white rounded-2xl border shadow-sm p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Shelter details
            </h2>
            <div className="space-y-3">
              <InfoRow label="Name" value={shelter.name} />
              <InfoRow label="City" value={shelter.city} />
              <InfoRow label="Address" value={shelter.address} />
              <InfoRow label="Phone" value={shelter.phone} />
              <InfoRow label="Contact email" value={shelter.email} />
              {shelter.website && (
                <InfoRow label="Website" value={shelter.website} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom nav for adopters on mobile */}
      {isAdopter && <BottomNav />}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-gray-400 flex-shrink-0 w-32">{label}</span>
      <span className="text-sm text-gray-800 text-right break-all">{value}</span>
    </div>
  );
}
