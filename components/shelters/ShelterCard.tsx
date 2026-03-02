import Link from "next/link";
import Image from "next/image";

type Props = {
  shelter: {
    id: string;
    name: string;
    city: string;
    _count: { pets: number };
    pets: { photos: string[] }[];
  };
};

export function ShelterCard({ shelter }: Props) {
  const coverPhoto = shelter.pets[0]?.photos[0] ?? null;

  return (
    <Link
      href={`/shelters/${shelter.id}`}
      className="group block bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
    >
      {/* Cover photo */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {coverPhoto ? (
          <Image
            src={coverPhoto}
            alt={shelter.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-5xl text-gray-200">
            🏠
          </div>
        )}
      </div>

      <div className="p-4 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-gray-900 truncate">{shelter.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">📍 {shelter.city}</p>
          <p className="text-xs text-amber-600 font-medium mt-2">
            {shelter._count.pets} pet{shelter._count.pets !== 1 ? "s" : ""}{" "}
            available
          </p>
        </div>
        <span className="text-gray-300 group-hover:text-amber-500 transition-colors text-lg mt-0.5 flex-shrink-0">
          →
        </span>
      </div>
    </Link>
  );
}
