/**
 * PawSwipe seed script
 * Creates 3 demo shelters with real pet photos from Unsplash.
 *
 * Run: npx tsx prisma/seed.ts
 *
 * Demo logins:
 *   happypaws@demo.com    / Demo1234!
 *   cityanimals@demo.com  / Demo1234!
 *   secondchance@demo.com / Demo1234!
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

const pool = new Pool({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// ─── Photo helper ─────────────────────────────────────────────────────────────

function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}?w=600&h=800&fit=crop`;
}

// ─── Shelter data ─────────────────────────────────────────────────────────────

const SHELTERS = [
  {
    email: "happypaws@demo.com",
    password: "Demo1234!",
    shelter: {
      name: "Happy Paws Shelter",
      phone: "03-555-1234",
      email: "happypaws@demo.com",
      address: "12 Rothschild Blvd",
      city: "Tel Aviv",
      website: "https://happypaws.demo",
    },
    pets: [
      {
        name: "Buddy",
        type: "DOG" as const,
        breed: "Golden Retriever",
        ageMonths: 18,
        size: "LARGE" as const,
        gender: "MALE" as const,
        city: "Tel Aviv",
        description:
          "Buddy is an affectionate Golden Retriever who lives for belly rubs and morning jogs. He's fully trained, great with children, and gets along beautifully with other dogs.",
        photos: [unsplash("1552053831-71594a27632d")],
      },
      {
        name: "Luna",
        type: "DOG" as const,
        breed: "Labrador Mix",
        ageMonths: 8,
        size: "MEDIUM" as const,
        gender: "FEMALE" as const,
        city: "Tel Aviv",
        description:
          "Luna is a bouncy, curious pup who picks up commands in minutes. She loves water, squeaky toys, and following her humans from room to room.",
        photos: [unsplash("1537151625747-768eb6cf92b2")],
      },
      {
        name: "Rex",
        type: "DOG" as const,
        breed: "German Shepherd",
        ageMonths: 36,
        size: "LARGE" as const,
        gender: "MALE" as const,
        city: "Tel Aviv",
        description:
          "Rex is a loyal and intelligent German Shepherd looking for an experienced owner. He's protective, calm indoors, and thrives with regular exercise and clear boundaries.",
        photos: [unsplash("1589941013453-ec89f33b5e95")],
      },
      {
        name: "Milo",
        type: "CAT" as const,
        breed: "Domestic Shorthair",
        ageMonths: 30,
        size: "SMALL" as const,
        gender: "MALE" as const,
        city: "Tel Aviv",
        description:
          "Milo is a laid-back tabby who spends his days watching birds from the windowsill. He's quiet, clean, and will purr himself to sleep on your lap every evening.",
        photos: [unsplash("1514888286974-6c03e2ca1dba")],
      },
      {
        name: "Bella",
        type: "CAT" as const,
        breed: "Persian",
        ageMonths: 48,
        size: "SMALL" as const,
        gender: "FEMALE" as const,
        city: "Tel Aviv",
        description:
          "Bella is a serene Persian cat who prefers calm households. She enjoys gentle brushing sessions, soft blankets, and classical music in the background.",
        photos: [unsplash("1574290685942-3e19f0bc3f45")],
      },
      {
        name: "Coco",
        type: "RABBIT" as const,
        breed: "Holland Lop",
        ageMonths: 6,
        size: "SMALL" as const,
        gender: "FEMALE" as const,
        city: "Tel Aviv",
        description:
          "Coco is a litter-trained Holland Lop who binkies around the living room every morning. She loves leafy greens and will nudge your hand for pets.",
        photos: [unsplash("1585110396000-c9ffd4e4b308")],
      },
      {
        name: "Daisy",
        type: "DOG" as const,
        breed: "Beagle",
        ageMonths: 24,
        size: "SMALL" as const,
        gender: "FEMALE" as const,
        city: "Tel Aviv",
        description:
          "Daisy is a cheerful Beagle who follows her nose everywhere. She's sociable, food-motivated, and absolutely loves hiking trails and sniff-and-snooze afternoons.",
        photos: [unsplash("1505628346881-b72b27e84530")],
      },
    ],
  },
  {
    email: "cityanimals@demo.com",
    password: "Demo1234!",
    shelter: {
      name: "City Animal Shelter",
      phone: "04-777-5678",
      email: "adopt@cityanimals.demo",
      address: "8 Ben Gurion Ave",
      city: "Haifa",
      website: "https://cityanimals.demo",
    },
    pets: [
      {
        name: "Max",
        type: "DOG" as const,
        breed: "Siberian Husky",
        ageMonths: 18,
        size: "LARGE" as const,
        gender: "MALE" as const,
        city: "Haifa",
        description:
          "Max is a striking Husky with icy blue eyes and endless energy. He needs daily runs, loves colder weather, and howls along to his favourite songs.",
        photos: [unsplash("1605568427561-40dd23c2acea")],
      },
      {
        name: "Rosie",
        type: "DOG" as const,
        breed: "Poodle Mix",
        ageMonths: 14,
        size: "SMALL" as const,
        gender: "FEMALE" as const,
        city: "Haifa",
        description:
          "Rosie is a hypoallergenic Poodle mix who loves learning new tricks. She's gentle with seniors and kids alike, and barely sheds.",
        photos: [unsplash("1574158622682-e40e69881006")],
      },
      {
        name: "Cooper",
        type: "DOG" as const,
        breed: "Labrador Mix",
        ageMonths: 6,
        size: "LARGE" as const,
        gender: "MALE" as const,
        city: "Haifa",
        description:
          "Cooper is a roly-poly puppy with the biggest paws you've ever seen. He's still learning the rules but makes up for it in unconditional love and comic timing.",
        photos: [unsplash("1561037404-61cd46aa615b")],
      },
      {
        name: "Oscar",
        type: "CAT" as const,
        breed: "Siamese",
        ageMonths: 60,
        size: "SMALL" as const,
        gender: "MALE" as const,
        city: "Haifa",
        description:
          "Oscar is a talkative Siamese who will narrate your entire day if you let him. He's opinionated, loving, and bonds deeply with one person.",
        photos: [unsplash("1561948955-570b270e7c36")],
      },
      {
        name: "Nala",
        type: "CAT" as const,
        breed: "Calico",
        ageMonths: 36,
        size: "SMALL" as const,
        gender: "FEMALE" as const,
        city: "Haifa",
        description:
          "Nala is a bold, inquisitive Calico who rules every room she enters. She's playful in the evenings and cuddly in the mornings.",
        photos: [unsplash("1529778873920-4da4926a72c2")],
      },
      {
        name: "Thumper",
        type: "RABBIT" as const,
        breed: "Dutch Rabbit",
        ageMonths: 24,
        size: "SMALL" as const,
        gender: "MALE" as const,
        city: "Haifa",
        description:
          "Thumper is a well-socialised Dutch rabbit who enjoys free-roaming time and learning simple commands. He's a great starter pet for families.",
        photos: [unsplash("1535241749838-299277b6305f")],
      },
      {
        name: "Polly",
        type: "BIRD" as const,
        breed: "African Grey Parrot",
        ageMonths: 60,
        size: "SMALL" as const,
        gender: "FEMALE" as const,
        city: "Haifa",
        description:
          "Polly has a vocabulary of over 50 words and uses them at exactly the right moment. She needs mental stimulation, social time, and a patient owner ready to be outsmarted.",
        photos: [unsplash("1552728089-57bdde30beb3")],
      },
    ],
  },
  {
    email: "secondchance@demo.com",
    password: "Demo1234!",
    shelter: {
      name: "Second Chance Rescue",
      phone: "02-333-9876",
      email: "hello@secondchance.demo",
      address: "44 Jaffa Road",
      city: "Jerusalem",
      website: "https://secondchance.demo",
    },
    pets: [
      {
        name: "Bear",
        type: "DOG" as const,
        breed: "Border Collie",
        ageMonths: 24,
        size: "MEDIUM" as const,
        gender: "MALE" as const,
        city: "Jerusalem",
        description:
          "Bear is a hyper-intelligent Border Collie who needs a job or he'll invent one. He excels at agility, frisbee, and staring at you until you play with him.",
        photos: [unsplash("1583337130417-3346a1be7dee")],
      },
      {
        name: "Whiskers",
        type: "DOG" as const,
        breed: "Dachshund",
        ageMonths: 36,
        size: "SMALL" as const,
        gender: "MALE" as const,
        city: "Jerusalem",
        description:
          "Whiskers is a stubborn but deeply loveable Dachshund. He does things on his own schedule, snores loudly, and thinks every lap belongs to him.",
        photos: [unsplash("1520087619250-584c0cbd35e8")],
      },
      {
        name: "Ruby",
        type: "DOG" as const,
        breed: "Beagle Mix",
        ageMonths: 10,
        size: "SMALL" as const,
        gender: "FEMALE" as const,
        city: "Jerusalem",
        description:
          "Ruby is a floppy-eared puppy with a nose that never stops working. She gets along with everyone she meets and approaches life with infectious enthusiasm.",
        photos: [unsplash("1586917138540-f1490b02f205")],
      },
      {
        name: "Lily",
        type: "CAT" as const,
        breed: "Maine Coon",
        ageMonths: 18,
        size: "MEDIUM" as const,
        gender: "FEMALE" as const,
        city: "Jerusalem",
        description:
          "Lily is a magnificent Maine Coon who carries herself like royalty. She's social, surprisingly dog-like in personality, and will greet you at the door every day.",
        photos: [unsplash("1543466835-00a7907e9de1")],
      },
      {
        name: "Shadow",
        type: "CAT" as const,
        breed: "Domestic Shorthair",
        ageMonths: 48,
        size: "SMALL" as const,
        gender: "MALE" as const,
        city: "Jerusalem",
        description:
          "Shadow earned his name by silently appearing wherever you least expect him. He's an independent soul who shows affection on his own terms — which makes it all the more special.",
        photos: [unsplash("1494256997604-768d1f608cac")],
      },
      {
        name: "Ginger",
        type: "CAT" as const,
        breed: "Domestic Shorthair",
        ageMonths: 14,
        size: "SMALL" as const,
        gender: "FEMALE" as const,
        city: "Jerusalem",
        description:
          "Ginger is a bright-eyed orange kitten who turned every foster home into a playground. She's ready for her forever family and has a purr that sounds like a motorboat.",
        photos: [unsplash("1750144546219-6913bf5bc2ac")],
      },
      {
        name: "Tweety",
        type: "BIRD" as const,
        breed: "Cockatiel",
        ageMonths: 12,
        size: "SMALL" as const,
        gender: "FEMALE" as const,
        city: "Jerusalem",
        description:
          "Tweety whistles tunes, steps up on command, and adores head scratches. She's perfect for a first-time bird owner looking for a small, cheerful companion.",
        photos: [unsplash("1517101724602-c257fe568157")],
      },
    ],
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getOrCreateAuthUser(email: string, password: string): Promise<string> {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: "SHELTER" },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already been registered")) {
      const { data: listData } = await supabase.auth.admin.listUsers();
      const existing = listData?.users?.find((u) => u.email === email);
      if (!existing) throw new Error(`Could not find existing auth user: ${email}`);
      console.log(`  Auth user already exists, reusing: ${existing.id}`);
      return existing.id;
    }
    throw new Error(`Supabase auth error for ${email}: ${error.message}`);
  }

  console.log(`  Auth user created: ${data.user!.id}`);
  return data.user!.id;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding PawSwipe...\n");

  for (const { email, password, shelter: shelterData, pets } of SHELTERS) {
    console.log(`\n📍 ${shelterData.name}`);

    const authId = await getOrCreateAuthUser(email, password);

    // Upsert Prisma user
    await prisma.user.upsert({
      where: { id: authId },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      create: { id: authId, email, role: "SHELTER" as any },
      update: {},
    });

    // Upsert shelter
    const shelter = await prisma.shelter.upsert({
      where: { userId: authId },
      create: { userId: authId, ...shelterData },
      update: {},
    });

    console.log(`  Shelter: ${shelter.id}`);

    // Create or update pets (photos are always synced to seed values)
    for (const pet of pets) {
      const existing = await prisma.pet.findFirst({
        where: { shelterId: shelter.id, name: pet.name },
      });

      if (existing) {
        await prisma.pet.update({
          where: { id: existing.id },
          data: { photos: pet.photos },
        });
        console.log(`  • ${pet.name} — updated photos`);
        continue;
      }

      await prisma.pet.create({ data: { ...pet, shelterId: shelter.id } });
      console.log(`  • ${pet.name} (${pet.breed}) — created`);
    }
  }

  console.log("\n✅ Seed complete!\n");
  console.log("Demo logins (all password: Demo1234!):");
  for (const { email } of SHELTERS) {
    console.log(`  ${email}`);
  }
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
