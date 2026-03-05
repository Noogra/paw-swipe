"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, null);

  return (
    <div className="glass-strong rounded-3xl p-8 shadow-xl">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-gray-900">Welcome back</h2>
        <p className="text-sm text-gray-500 mt-1">Sign in to your account to continue</p>
      </div>

      <form action={action} className="space-y-5">
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
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="rounded-xl border-amber-200/60 focus:ring-amber-300 bg-white/70"
          />
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            name="remember"
            defaultChecked
            className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
          />
          <span className="text-sm text-gray-600">Remember me</span>
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #d97706, #f59e0b)",
            boxShadow: "0 4px 20px rgba(217,119,6,0.3)",
          }}
        >
          {isPending ? "Signing in…" : "Sign In →"}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-amber-600 font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
