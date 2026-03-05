"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { register } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Role = "ADOPTER" | "SHELTER";

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("ADOPTER");
  const [state, action, isPending] = useActionState(register, null);

  return (
    <div className="glass-strong rounded-3xl p-8 shadow-xl">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-gray-900">Create an account</h2>
        <p className="text-sm text-gray-500 mt-1">
          Are you looking to adopt, or registering a shelter?
        </p>
      </div>

      <form action={action} className="space-y-5">
        <input type="hidden" name="role" value={role} />

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl" style={{ background: "rgba(217,119,6,0.08)" }}>
          <button
            type="button"
            onClick={() => setRole("ADOPTER")}
            className={`py-2 text-sm font-medium rounded-xl transition-all ${
              role === "ADOPTER"
                ? "glass-strong text-amber-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            🐾 I want to adopt
          </button>
          <button
            type="button"
            onClick={() => setRole("SHELTER")}
            className={`py-2 text-sm font-medium rounded-xl transition-all ${
              role === "SHELTER"
                ? "glass-strong text-amber-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            🏠 I run a shelter
          </button>
        </div>

        {state?.error && (
          <div
            className="text-sm px-4 py-3 rounded-xl border"
            style={{
              background: "rgba(239,68,68,0.08)",
              borderColor: "rgba(239,68,68,0.3)",
              color: "#b91c1c",
            }}
          >
            {state.error}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="rounded-xl border-amber-200/60 focus:ring-amber-300 bg-white/70"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="At least 6 characters"
            required
            autoComplete="new-password"
            className="rounded-xl border-amber-200/60 focus:ring-amber-300 bg-white/70"
          />
        </div>

        {role === "SHELTER" && (
          <div className="space-y-4 pt-3 border-t border-amber-200/40">
            <p className="font-mono text-xs text-amber-600/70 uppercase tracking-widest">
              // Shelter details
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="shelterName" className="text-sm font-medium text-gray-700">Shelter Name</Label>
              <Input
                id="shelterName"
                name="shelterName"
                placeholder="Happy Paws Rescue"
                required={role === "SHELTER"}
                className="rounded-xl border-amber-200/60 focus:ring-amber-300 bg-white/70"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="shelterPhone" className="text-sm font-medium text-gray-700">Phone</Label>
                <Input
                  id="shelterPhone"
                  name="shelterPhone"
                  type="tel"
                  placeholder="+1 555 0100"
                  required={role === "SHELTER"}
                  className="rounded-xl border-amber-200/60 focus:ring-amber-300 bg-white/70"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="shelterCity" className="text-sm font-medium text-gray-700">City</Label>
                <Input
                  id="shelterCity"
                  name="shelterCity"
                  placeholder="Melbourne"
                  required={role === "SHELTER"}
                  className="rounded-xl border-amber-200/60 focus:ring-amber-300 bg-white/70"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="shelterAddress" className="text-sm font-medium text-gray-700">Address</Label>
              <Input
                id="shelterAddress"
                name="shelterAddress"
                placeholder="123 Main St"
                required={role === "SHELTER"}
                className="rounded-xl border-amber-200/60 focus:ring-amber-300 bg-white/70"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="shelterEmail" className="text-sm font-medium text-gray-700">
                Contact Email{" "}
                <span className="text-gray-400 font-normal">(public)</span>
              </Label>
              <Input
                id="shelterEmail"
                name="shelterEmail"
                type="email"
                placeholder="adopt@happypaws.org"
                className="rounded-xl border-amber-200/60 focus:ring-amber-300 bg-white/70"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="shelterWebsite" className="text-sm font-medium text-gray-700">
                Website{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <Input
                id="shelterWebsite"
                name="shelterWebsite"
                type="url"
                placeholder="https://happypaws.org"
                className="rounded-xl border-amber-200/60 focus:ring-amber-300 bg-white/70"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #d97706, #f59e0b)",
            boxShadow: "0 4px 20px rgba(217,119,6,0.3)",
          }}
        >
          {isPending ? "Creating account…" : "Create Account →"}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
