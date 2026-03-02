/**
 * PawSwipe seed script
 * Creates a mock shelter auth user + 5 pets for local development.
 *
 * Run: npx tsx prisma/seed.ts
 *
 * Credentials after seeding:
 *   Email:    happypaws@demo.com
 *   Password: Demo1234!
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

// ─── Clients ──────────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Use the session-pooler (DIRECT_URL) to avoid PgBouncer issues
const pool = new Pool({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// ─── Mock data ────────────────────────────────────────────────────────────────

const SHELTER_EMAIL = "happypaws@demo.com";
const SHELTER_PASSWORD = "Demo1234!";

// picsum.photos IDs — stable, real-ish pet photos
const PETS = [
  {
    name: "Buddy",
    type: "DOG" as const,
    breed: "Golden Retriever",
    ageMonths: 18,
    size: "LARGE" as const,
    gender: "MALE" as const,
    description:
      "Buddy is a gentle giant who loves long walks, fetch, and cuddles on the couch. He's great with kids and other dogs.",
    photos: ["https://picsum.photos/id/237/600/800"],
    city: "Tel Aviv",
  },
  {
    name: "Luna",
    type: "DOG" as const,
    breed: "Labrador",
    ageMonths: 8,
    size: "MEDIUM" as const,
    gender: "FEMALE" as const,
    description:
      "Luna is a playful pup who learns tricks fast. She's full of energy in the morning but loves nap time just as much.",
    photos: ["https://picsum.photos/id/1025/600/800"],
    city: "Haifa",
  },
  {
    name: "Milo",
    type: "CAT" as const,
    breed: "Domestic Shorthair",
    ageMonths: 30,
    size: "SMALL" as const,
    gender: "MALE" as const,
    description:
      "Milo is an independent cat who warms up quickly. He loves sunny spots, window sills, and the occasional ear scratch.",
    photos: ["https://picsum.photos/id/177/600/800"],
    city: "Jerusalem",
  },
  {
    name: "Bella",
    type: "CAT" as const,
    breed: "Persian",
    ageMonths: 48,
    size: "SMALL" as const,
    gender: "FEMALE" as const,
    description:
      "Bella is a calm and elegant Persian cat. She prefers quiet homes and will reward you with soft purrs every evening.",
    photos: ["https://picsum.photos/id/1062/600/800"],
    city: "Tel Aviv",
  },
  {
    name: "Coco",
    type: "RABBIT" as const,
    breed: "Holland Lop",
    ageMonths: 6,
    size: "SMALL" as const,
    gender: "FEMALE" as const,
    description:
      "Coco is a fluffy Holland Lop who loves to explore. She's litter trained, curious, and bonds quickly with her human.",
    photos: ["https://picsum.photos/id/593/600/800"],
    city: "Beer Sheva",
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding PawSwipe...\n");

  // 1. Create Supabase auth user (or reuse if already exists)
  let authUserId: string;

  const { data: createData, error: createError } =
    await supabase.auth.admin.createUser({
      email: SHELTER_EMAIL,
      password: SHELTER_PASSWORD,
      email_confirm: true,
      user_metadata: { role: "SHELTER" },
    });

  if (createError) {
    if (createError.message.toLowerCase().includes("already been registered")) {
      // Fetch existing user
      const { data: listData } = await supabase.auth.admin.listUsers();
      const existing = listData?.users?.find((u) => u.email === SHELTER_EMAIL);
      if (!existing) throw new Error("Could not find existing auth user.");
      authUserId = existing.id;
      console.log(`Auth user already exists (${authUserId}), reusing.`);
    } else {
      throw new Error(`Supabase auth error: ${createError.message}`);
    }
  } else {
    authUserId = createData.user!.id;
    console.log(`Auth user created: ${authUserId}`);
  }

  // 2. Upsert Prisma User
  const user = await prisma.user.upsert({
    where: { id: authUserId },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create: { id: authUserId, email: SHELTER_EMAIL, role: "SHELTER" as any },
    update: {},
  });
  console.log(`Prisma User: ${user.id}`);

  // 3. Upsert Shelter
  const shelter = await prisma.shelter.upsert({
    where: { userId: authUserId },
    create: {
      userId: authUserId,
      name: "Happy Paws Shelter",
      phone: "03-555-1234",
      email: SHELTER_EMAIL,
      address: "12 Rothschild Blvd",
      city: "Tel Aviv",
      website: "https://happypaws.demo",
    },
    update: {},
  });
  console.log(`Shelter: ${shelter.id} — ${shelter.name}`);

  // 4. Create pets (skip if already created for this shelter)
  for (const pet of PETS) {
    const existing = await prisma.pet.findFirst({
      where: { shelterId: shelter.id, name: pet.name },
    });

    if (existing) {
      console.log(`  Pet "${pet.name}" already exists, skipping.`);
      continue;
    }

    const created = await prisma.pet.create({
      data: { ...pet, shelterId: shelter.id },
    });
    console.log(`  Created pet: ${created.name} (${created.id})`);
  }

  console.log("\n✅ Seed complete!\n");
  console.log("  Shelter login:");
  console.log(`  Email:    ${SHELTER_EMAIL}`);
  console.log(`  Password: ${SHELTER_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
