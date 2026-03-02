import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/login", "/register", "/shelters"];

// Routes restricted by role
const SHELTER_ROUTES = ["/dashboard"];
const ADOPTER_ROUTES = ["/feed", "/liked"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — IMPORTANT: do not run logic between createServerClient and getUser
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicRoute = PUBLIC_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`)
  );

  // Not logged in — redirect to /login for protected routes
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Logged in — redirect away from auth pages
  if (user && (pathname === "/login" || pathname === "/register")) {
    const role: string = user.user_metadata?.role ?? "ADOPTER";
    const url = request.nextUrl.clone();
    url.pathname = role === "SHELTER" ? "/dashboard" : "/feed";
    return NextResponse.redirect(url);
  }

  // Role-based protection
  if (user) {
    const role: string = user.user_metadata?.role ?? "ADOPTER";

    const isShelterRoute = SHELTER_ROUTES.some((r) => pathname.startsWith(r));
    const isAdopterRoute = ADOPTER_ROUTES.some((r) => pathname.startsWith(r));

    if (isShelterRoute && role !== "SHELTER") {
      const url = request.nextUrl.clone();
      url.pathname = "/feed";
      return NextResponse.redirect(url);
    }

    if (isAdopterRoute && role !== "ADOPTER") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
