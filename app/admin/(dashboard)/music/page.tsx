import MusicClient from "@/components/admin/MusicClient";
import { prisma } from "@/lib/prisma";
import { hasValidPostgresDatabaseUrl } from "@/lib/database-url";

export const dynamic = "force-dynamic";
const ADMIN_LIST_LIMIT = 200;

export default async function AdminMusicPage() {
  if (!hasValidPostgresDatabaseUrl()) {
    return <MusicClient initialMusic={[]} />;
  }

  let music: Awaited<ReturnType<typeof prisma.music.findMany>> = [];

  try {
    music = await prisma.music.findMany({
      orderBy: { createdAt: "desc" },
      take: ADMIN_LIST_LIMIT,
    });
  } catch (error) {
    console.warn("Music data unavailable; rendering empty list.", error);
  }

  return <MusicClient initialMusic={music} />;
}
