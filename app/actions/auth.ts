"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export type AuthState = { error: string } | null;

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password are required." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message };

  const role: string = data.user.user_metadata?.role ?? "ADOPTER";
  redirect(role === "SHELTER" ? "/dashboard" : "/feed");
}

// ─── Register ─────────────────────────────────────────────────────────────────

export async function register(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as "ADOPTER" | "SHELTER";

  if (!email || !password || !role)
    return { error: "All required fields must be filled in." };

  if (password.length < 6)
    return { error: "Password must be at least 6 characters." };

  // Shelter-specific fields
  const shelterName = formData.get("shelterName") as string | null;
  const shelterPhone = formData.get("shelterPhone") as string | null;
  const shelterEmail = formData.get("shelterEmail") as string | null;
  const shelterAddress = formData.get("shelterAddress") as string | null;
  const shelterCity = formData.get("shelterCity") as string | null;
  const shelterWebsite = formData.get("shelterWebsite") as string | null;

  if (role === "SHELTER") {
    if (!shelterName || !shelterPhone || !shelterAddress || !shelterCity) {
      return { error: "Please fill in all shelter details." };
    }
  }

  const supabase = await createClient();

  // 1. Create Supabase Auth user (role stored in user_metadata for middleware)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role } },
  });

  if (error) return { error: error.message };
  if (!data.user) return { error: "Could not create account. Please try again." };

  // 2. Email confirmation required — session will be null
  if (!data.session) {
    return {
      error:
        "Check your email to confirm your account, then log in. (Tip: disable email confirmation in Supabase Auth settings for development.)",
    };
  }

  // 3. Mirror user into Prisma DB
  try {
    await prisma.user.create({
      data: {
        id: data.user.id,
        email,
        role,
        ...(role === "SHELTER" && {
          shelter: {
            create: {
              name: shelterName!,
              phone: shelterPhone!,
              email: shelterEmail || email,
              address: shelterAddress!,
              city: shelterCity!,
              website: shelterWebsite || null,
            },
          },
        }),
      },
    });
  } catch (dbError) {
    console.error("DB user creation failed:", dbError);
    // Auth user was created but DB failed — clean up by signing out
    await supabase.auth.signOut();
    return { error: "Account setup failed. Please try again." };
  }

  redirect(role === "SHELTER" ? "/dashboard" : "/feed");
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
