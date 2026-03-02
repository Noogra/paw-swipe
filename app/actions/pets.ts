"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export type PetFormState = { error?: string; success?: boolean } | null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getAuthenticatedShelter() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const shelter = await prisma.shelter.findUnique({
    where: { userId: user.id },
  });
  return shelter;
}

// ─── Create Pet ───────────────────────────────────────────────────────────────

export async function createPet(
  _prevState: PetFormState,
  formData: FormData
): Promise<PetFormState> {
  const shelter = await getAuthenticatedShelter();
  if (!shelter) return { error: "Not authorised." };

  const name = (formData.get("name") as string)?.trim();
  const type = formData.get("type") as string;
  const breed = (formData.get("breed") as string)?.trim() || null;
  const ageValue = parseInt(formData.get("ageValue") as string, 10);
  const ageUnit = formData.get("ageUnit") as "months" | "years";
  const size = formData.get("size") as string;
  const gender = formData.get("gender") as string;
  const description = (formData.get("description") as string)?.trim();
  const city = (formData.get("city") as string)?.trim() || shelter.city;
  const photosJson = formData.get("photos") as string;

  if (!name || !type || !size || !gender || !description || isNaN(ageValue)) {
    return { error: "Please fill in all required fields." };
  }

  const photos = photosJson ? (JSON.parse(photosJson) as string[]) : [];
  if (photos.length === 0) return { error: "Please upload at least one photo." };

  const ageMonths = ageUnit === "years" ? ageValue * 12 : ageValue;

  await prisma.pet.create({
    data: {
      shelterId: shelter.id,
      name,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: type as any,
      breed,
      ageMonths,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      size: size as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      gender: gender as any,
      description,
      photos,
      city,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

// ─── Delete Pet ───────────────────────────────────────────────────────────────

export async function deletePet(petId: string): Promise<void> {
  const shelter = await getAuthenticatedShelter();
  if (!shelter) return;

  // Verify ownership before deleting
  await prisma.pet.deleteMany({
    where: { id: petId, shelterId: shelter.id },
  });

  revalidatePath("/dashboard");
}

// ─── Toggle Active ────────────────────────────────────────────────────────────

export async function togglePetActive(
  petId: string,
  isActive: boolean
): Promise<void> {
  const shelter = await getAuthenticatedShelter();
  if (!shelter) return;

  await prisma.pet.updateMany({
    where: { id: petId, shelterId: shelter.id },
    data: { isActive },
  });

  revalidatePath("/dashboard");
}
