export default function FeedLoading() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 px-4 py-8">
      {/* Card skeleton */}
      <div className="relative w-full max-w-sm">
        <div className="w-full aspect-[3/4] rounded-3xl bg-gray-200 animate-pulse" />
        {/* Info bar skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
          <div className="h-6 w-32 bg-gray-300 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>

      {/* Action buttons skeleton */}
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse" />
        <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}
