export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🐾</div>
          <h1 className="text-3xl font-bold text-amber-600">PawSwipe</h1>
          <p className="text-gray-500 mt-1 text-sm">Find your perfect companion</p>
        </div>
        {children}
      </div>
    </div>
  );
}
