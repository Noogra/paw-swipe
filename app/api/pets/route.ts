import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json([], { status: 401 });

  const { searchParams } = request.nextUrl;

  // Parse exclude list (pets already in the client stack)
  const excludeParam = searchParams.get("exclude") ?? "";
  const stackIds = excludeParam ? excludeParam.split(",").filter(Boolean) : [];

  // Parse filters
  const type = searchParams.get("type") || null;
  const size = searchParams.get("size") || null;
  const gender = searchParams.get("gender") || null;
  const city = searchParams.get("city") || null;

  // Get all pet IDs this user has already swiped (from DB)
  const swipedIds = await prisma.swipe
    .findMany({ where: { userId: user.id }, select: { petId: true } })
    .then((rows) => rows.map((r) => r.petId));

  const allExclude = [...new Set([...swipedIds, ...stackIds])];

  const pets = await prisma.pet.findMany({
    where: {
      isActive: true,
      ...(allExclude.length > 0 && { id: { notIn: allExclude } }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(type && { type: type as any }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(size && { size: size as any }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(gender && { gender: gender as any }),
      ...(city && {
        city: { contains: city, mode: "insensitive" as const },
      }),
    },
    select: {
      id: true,
      name: true,
      type: true,
      breed: true,
      ageMonths: true,
      size: true,
      gender: true,
      description: true,
      photos: true,
      city: true,
      shelter: { select: { name: true, phone: true, email: true } },
    },
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  return Response.json(pets);
}
