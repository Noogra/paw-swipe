import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient(options?: { remember?: boolean }) {
  const cookieStore = await cookies();
  const remember = options?.remember ?? true;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options: cookieOpts }) => {
              const opts = remember
                ? cookieOpts
                : { ...cookieOpts, maxAge: undefined, expires: undefined };
              cookieStore.set(name, value, opts);
            });
          } catch {
            // Called from a Server Component — cookies can't be set here.
            // Middleware handles session refresh.
          }
        },
      },
    }
  );
}
