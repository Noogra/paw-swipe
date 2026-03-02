import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/ui/Navbar";
import { ShelterCard } from "@/components/shelters/ShelterCard";

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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-b from-orange-50 via-amber-50/60 to-white py-20 px-4 text-center">
        <div className="text-6xl mb-5">🐾</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Find your next
          <br />
          <span className="text-amber-500">best friend</span>
        </h1>
        <p className="text-gray-500 mt-4 text-base max-w-sm mx-auto leading-relaxed">
          Browse adoptable pets from shelters near you. Swipe right on the ones
          you love.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
          <Link
            href="/feed"
            className="bg-amber-500 text-white font-semibold px-7 py-3 rounded-full hover:bg-amber-600 active:scale-95 transition-all shadow-sm"
          >
            Start swiping →
          </Link>
          <a
            href="#shelters"
            className="text-gray-600 font-medium px-7 py-3 rounded-full border border-gray-200 hover:border-amber-300 hover:text-amber-700 transition-colors"
          >
            Browse shelters
          </a>
        </div>
      </div>

      {/* Shelter grid */}
      <main id="shelters" className="max-w-5xl mx-auto px-4 pb-16 pt-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">
          Shelters with pets available
        </h2>
        {shelters.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">🏠</div>
            <p className="font-medium text-gray-500">No shelters yet</p>
            <p className="text-sm mt-1">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shelters.map((shelter) => (
              <ShelterCard key={shelter.id} shelter={shelter} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
