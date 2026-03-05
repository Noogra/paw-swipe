import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = user?.user_metadata?.role as "ADOPTER" | "SHELTER" | undefined;
  const isShelter = role === "SHELTER";
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "";

  return (
    <header className="glass sticky top-0 z-50 px-5 py-3.5 flex items-center justify-between">
      <Link
        href="/"
        className="text-2xl font-bold font-serif text-amber-700 hover:text-amber-800 transition-colors amber-glow"
      >
        🐾 PawSwipe
      </Link>

      <nav className="flex items-center gap-3">
        {user ? (
          isShelter ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors amber-glow"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/feed"
                className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors amber-glow"
              >
                Discover
              </Link>
              <Link
                href="/liked"
                className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors amber-glow"
              >
                Liked ❤️
              </Link>
            </div>
          )
        ) : null}

        {user ? (
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="w-9 h-9 rounded-full bg-amber-100 hover:bg-amber-200 flex items-center justify-center text-xs font-bold text-amber-700 transition-all hover:scale-105 select-none border border-amber-200/60"
              title="Profile"
            >
              {initials}
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="liquid-glass rounded-full px-4 py-1.5 text-sm font-medium text-amber-700 hover:text-amber-800 transition-all hover:scale-105"
              >
                Log out
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="liquid-glass rounded-full px-4 py-1.5 text-sm font-medium text-amber-700 hover:text-amber-800 transition-all hover:scale-105"
            >
              Sign up
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
