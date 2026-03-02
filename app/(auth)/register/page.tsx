"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { register } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Role = "ADOPTER" | "SHELTER";

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("ADOPTER");
  const [state, action, isPending] = useActionState(register, null);

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Are you looking to adopt, or registering a shelter?
        </CardDescription>
      </CardHeader>

      <form action={action}>
        {/* Hidden role field so the server action can read it */}
        <input type="hidden" name="role" value={role} />

        <CardContent className="space-y-5">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setRole("ADOPTER")}
              className={`py-2 text-sm font-medium rounded-md transition-all ${
                role === "ADOPTER"
                  ? "bg-white shadow text-amber-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              I want to adopt
            </button>
            <button
              type="button"
              onClick={() => setRole("SHELTER")}
              className={`py-2 text-sm font-medium rounded-md transition-all ${
                role === "SHELTER"
                  ? "bg-white shadow text-amber-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              I run a shelter
            </button>
          </div>

          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {state.error}
            </div>
          )}

          {/* Common fields */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              required
              autoComplete="new-password"
            />
          </div>

          {/* Shelter-specific fields */}
          {role === "SHELTER" && (
            <div className="space-y-4 pt-2 border-t">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Shelter Details
              </p>

              <div className="space-y-2">
                <Label htmlFor="shelterName">Shelter Name</Label>
                <Input
                  id="shelterName"
                  name="shelterName"
                  placeholder="Happy Paws Rescue"
                  required={role === "SHELTER"}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="shelterPhone">Phone</Label>
                  <Input
                    id="shelterPhone"
                    name="shelterPhone"
                    type="tel"
                    placeholder="+1 555 0100"
                    required={role === "SHELTER"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shelterCity">City</Label>
                  <Input
                    id="shelterCity"
                    name="shelterCity"
                    placeholder="Melbourne"
                    required={role === "SHELTER"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shelterAddress">Address</Label>
                <Input
                  id="shelterAddress"
                  name="shelterAddress"
                  placeholder="123 Main St"
                  required={role === "SHELTER"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shelterEmail">
                  Contact Email{" "}
                  <span className="text-gray-400 font-normal">(public)</span>
                </Label>
                <Input
                  id="shelterEmail"
                  name="shelterEmail"
                  type="email"
                  placeholder="adopt@happypaws.org"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shelterWebsite">
                  Website{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </Label>
                <Input
                  id="shelterWebsite"
                  name="shelterWebsite"
                  type="url"
                  placeholder="https://happypaws.org"
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Creating account…" : "Create Account"}
          </Button>

          <p className="text-sm text-gray-500 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-amber-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
