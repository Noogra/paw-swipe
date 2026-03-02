"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function recordSwipe(
  petId: string,
  direction: "LEFT" | "RIGHT"
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await prisma.swipe.upsert({
    where: { userId_petId: { userId: user.id, petId } },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create: { userId: user.id, petId, direction: direction as any },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update: { direction: direction as any },
  });
}

export async function removeSwipe(petId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await prisma.swipe.deleteMany({
    where: { userId: user.id, petId },
  });

  revalidatePath("/liked");
}
