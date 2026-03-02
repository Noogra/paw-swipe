import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="text-7xl mb-4">🐾</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-gray-500 mb-6">
        Looks like this page ran away. It happens to the best of us.
      </p>
      <Link
        href="/"
        className="bg-amber-500 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-amber-600 transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
