import SpotlightClient from "@/components/admin/SpotlightClient";
import { prisma } from "@/lib/prisma";
import { hasValidPostgresDatabaseUrl } from "@/lib/database-url";

export const dynamic = "force-dynamic";
const ADMIN_LIST_LIMIT = 200;

export default async function AdminSpotlightPage() {
  if (!hasValidPostgresDatabaseUrl()) {
    return <SpotlightClient initialSpotlights={[]} />;
  }

  let spotlights: Awaited<ReturnType<typeof prisma.spotlight.findMany>> = [];

  try {
    spotlights = await prisma.spotlight.findMany({
      orderBy: { createdAt: "desc" },
      take: ADMIN_LIST_LIMIT,
    });
  } catch (error) {
    console.warn("Spotlight data unavailable; rendering empty list.", error);
  }

  return <SpotlightClient initialSpotlights={spotlights} />;
}
