import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/ui/Navbar";
import { BottomNav } from "@/components/ui/BottomNav";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const role = (user.user_metadata?.role as "ADOPTER" | "SHELTER") ?? "ADOPTER";
  const isAdopter = role === "ADOPTER";

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { createdAt: true },
  });

  const memberSince = dbUser?.createdAt
    ? new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
        new Date(dbUser.createdAt)
      )
    : null;

  let likedCount = 0;
  if (isAdopter) {
    likedCount = await prisma.swipe.count({
      where: { userId: user.id, direction: "RIGHT" },
    });
  }

  let totalSwipes = 0;
  if (isAdopter) {
    totalSwipes = await prisma.swipe.count({ where: { userId: user.id } });
  }

  const shelter = !isAdopter
    ? await prisma.shelter.findUnique({ where: { userId: user.id } })
    : null;

  const email = user.email ?? "";
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-warm)" }}>
      <Navbar />

      <main
        className={`max-w-2xl mx-auto px-4 py-8 ${
          isAdopter ? "pb-28 sm:pb-10" : "pb-10"
        }`}
      >
        <AnimatedSection className="mb-6">
          <p className="font-mono text-xs tracking-widest text-amber-600 uppercase mb-1">
            // Your profile
          </p>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Account</h1>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-12 gap-4">
          {/* Identity card — spans 12 cols */}
          <StaggerItem className="col-span-12">
            <div className="glass rounded-3xl p-6 flex items-center gap-5">
              {/* Avatar with amber ring */}
              <div className="relative flex-shrink-0">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)", padding: "2px", borderRadius: "9999px" }}
                />
                <div className="relative w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-2xl font-bold text-amber-700 select-none border-2 border-white">
                  {initials}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 truncate">{email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span
                    className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(217,119,6,0.12)",
                      color: "#92400e",
                      border: "1px solid rgba(217,119,6,0.2)",
                    }}
                  >
                    {isAdopter ? "🐾 Adopter" : "🏠 Shelter"}
                  </span>
                  {memberSince && (
                    <span className="font-mono text-xs text-gray-400">since {memberSince}</span>
                  )}
                </div>
              </div>
            </div>
          </StaggerItem>

          {/* Adopter stats — bento */}
          {isAdopter && (
            <>
              <StaggerItem className="col-span-6">
                <div className="liquid-glass rounded-3xl p-5 flex flex-col gap-1 h-full">
                  <span className="font-mono text-xs text-amber-600/70 uppercase tracking-widest">Total swipes</span>
                  <span className="font-serif text-4xl font-black text-gray-900 mt-1">{totalSwipes}</span>
                  <span className="text-xs text-gray-500">pets reviewed</span>
                </div>
              </StaggerItem>

              <StaggerItem className="col-span-6">
                <div className="liquid-glass rounded-3xl p-5 flex flex-col gap-1 h-full">
                  <span className="font-mono text-xs text-amber-600/70 uppercase tracking-widest">Liked</span>
                  <span className="font-serif text-4xl font-black text-amber-700 mt-1">{likedCount}</span>
                  <span className="text-xs text-gray-500">pets you love</span>
                  {likedCount > 0 && (
                    <Link
                      href="/liked"
                      className="text-xs text-amber-600 font-semibold hover:underline mt-auto pt-2"
                    >
                      View all →
                    </Link>
                  )}
                </div>
              </StaggerItem>
            </>
          )}

          {/* Shelter info */}
          {shelter && (
            <StaggerItem className="col-span-12">
              <div className="glass rounded-3xl p-6">
                <p className="font-mono text-xs text-amber-600/70 uppercase tracking-widest mb-4">
                  // Shelter details
                </p>
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
            </StaggerItem>
          )}
        </StaggerContainer>
      </main>

      {isAdopter && <BottomNav />}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="font-mono text-xs text-gray-400 flex-shrink-0 w-32 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-gray-800 text-right break-all">{value}</span>
    </div>
  );
}
