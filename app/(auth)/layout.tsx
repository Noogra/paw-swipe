export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--grad-hero)" }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🐾</div>
          <h1 className="font-serif text-4xl font-black text-amber-700">PawSwipe</h1>
          <p className="font-mono text-xs tracking-widest text-amber-600/70 uppercase mt-2">
            // Find your perfect companion
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
