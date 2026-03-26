import CharactersClient from "@/components/admin/CharactersClient";
import { prisma } from "@/lib/prisma";
import { hasValidPostgresDatabaseUrl } from "@/lib/database-url";

export const dynamic = "force-dynamic";
const ADMIN_LIST_LIMIT = 200;

export default async function AdminCharactersPage() {
  if (!hasValidPostgresDatabaseUrl()) {
    return <CharactersClient initialCharacters={[]} />;
  }

  let characters: Awaited<ReturnType<typeof prisma.character.findMany>> = [];

  try {
    characters = await prisma.character.findMany({
      orderBy: { createdAt: "desc" },
      take: ADMIN_LIST_LIMIT,
    });
  } catch (error) {
    console.warn("Characters data unavailable; rendering empty list.", error);
  }

  return <CharactersClient initialCharacters={characters} />;
}
