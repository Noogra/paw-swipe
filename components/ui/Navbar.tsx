import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = user?.user_metadata?.role as "ADOPTER" | "SHELTER" | undefined;
  const isShelter = role === "SHELTER";
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "";

  return (
    <header className="bg-white/90 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link
        href="/"
        className="text-xl font-bold text-amber-600 hover:text-amber-700 transition-colors"
      >
        🐾 PawSwipe
      </Link>

      <nav className="flex items-center gap-3">
        {user ? (
          isShelter ? (
            /* Shelter nav — always visible */
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            /* Adopter nav — hidden on mobile (lives in BottomNav) */
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/feed"
                className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors"
              >
                Discover
              </Link>
              <Link
                href="/liked"
                className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors"
              >
                Liked ❤️
              </Link>
            </div>
          )
        ) : null}

        {user ? (
          <div className="flex items-center gap-2">
            {/* Avatar button — links to profile */}
            <Link
              href="/profile"
              className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 flex items-center justify-center text-xs font-bold text-amber-700 transition-colors select-none"
              title="Profile"
            >
              {initials}
            </Link>
            <form action={logout}>
              <Button variant="outline" size="sm" type="submit">
                Log out
              </Button>
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
            <Link href="/register">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
