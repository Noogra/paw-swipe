"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { SwipeFilters } from "@/lib/types";

interface Props {
  activeFilters: SwipeFilters;
}

const PET_TYPES = [
  { value: "", label: "All types" },
  { value: "DOG", label: "Dogs 🐕" },
  { value: "CAT", label: "Cats 🐈" },
  { value: "RABBIT", label: "Rabbits 🐇" },
  { value: "BIRD", label: "Birds 🐦" },
  { value: "OTHER", label: "Other" },
];

const SIZES = [
  { value: "", label: "Any size" },
  { value: "SMALL", label: "Small" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LARGE", label: "Large" },
];

const GENDERS = [
  { value: "", label: "Any gender" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

const selectStyle = {
  background: "rgba(255, 237, 213, 0.45)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(217, 119, 6, 0.2)",
  boxShadow: "0 2px 8px rgba(217,119,6,0.06)",
} as React.CSSProperties;

export function FilterPanel({ activeFilters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/feed?${params.toString()}`);
  }

  const hasActiveFilters =
    activeFilters.type || activeFilters.size || activeFilters.gender || activeFilters.city;

  return (
    <div className="w-full max-w-lg">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {/* Type */}
        <select
          value={activeFilters.type ?? ""}
          onChange={(e) => update("type", e.target.value)}
          className="shrink-0 text-sm rounded-full px-3 py-1.5 outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer font-medium text-amber-800"
          style={selectStyle}
        >
          {PET_TYPES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Size */}
        <select
          value={activeFilters.size ?? ""}
          onChange={(e) => update("size", e.target.value)}
          className="shrink-0 text-sm rounded-full px-3 py-1.5 outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer font-medium text-amber-800"
          style={selectStyle}
        >
          {SIZES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Gender */}
        <select
          value={activeFilters.gender ?? ""}
          onChange={(e) => update("gender", e.target.value)}
          className="shrink-0 text-sm rounded-full px-3 py-1.5 outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer font-medium text-amber-800"
          style={selectStyle}
        >
          {GENDERS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* City */}
        <input
          type="text"
          placeholder="City..."
          defaultValue={activeFilters.city ?? ""}
          onBlur={(e) => update("city", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              update("city", (e.target as HTMLInputElement).value);
          }}
          className="shrink-0 w-28 text-sm rounded-full px-3 py-1.5 outline-none focus:ring-2 focus:ring-amber-300 font-medium text-amber-800 placeholder:text-amber-600/50"
          style={selectStyle}
        />

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={() => router.push("/feed")}
            className="shrink-0 text-sm text-amber-600 font-semibold hover:text-amber-700 px-2 py-1.5 transition-colors"
          >
            Reset ×
          </button>
        )}
      </div>
    </div>
  );
}
