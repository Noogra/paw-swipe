"use client";

interface Props {
  onNope: () => void;
  onLike: () => void;
  disabled?: boolean;
}

export function ActionButtons({ onNope, onLike, disabled }: Props) {
  return (
    <div className="flex items-center gap-10">
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={onNope}
          disabled={disabled}
          className="w-16 h-16 rounded-full bg-white shadow-lg border-2 border-red-200 text-red-400 text-2xl flex items-center justify-center hover:bg-red-50 hover:border-red-400 hover:scale-110 active:scale-95 transition-all disabled:opacity-40"
          aria-label="Pass"
        >
          ✕
        </button>
        <span className="text-xs text-gray-400 font-medium">Pass</span>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={onLike}
          disabled={disabled}
          className="w-16 h-16 rounded-full bg-white shadow-lg border-2 border-green-200 text-green-400 text-2xl flex items-center justify-center hover:bg-green-50 hover:border-green-400 hover:scale-110 active:scale-95 transition-all disabled:opacity-40"
          aria-label="Like"
        >
          ❤️
        </button>
        <span className="text-xs text-gray-400 font-medium">Like</span>
      </div>
    </div>
  );
}
