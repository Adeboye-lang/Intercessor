import { prisma } from "@/lib/prisma";
import { hasValidPostgresDatabaseUrl } from "@/lib/database-url";
import PagesClient from "@/components/admin/PagesClient";

export const revalidate = 0;
const ADMIN_LIST_LIMIT = 200;

export default async function PagesAdmin() {
  if (!hasValidPostgresDatabaseUrl()) {
    return <PagesClient initialPages={[]} />;
  }

  let pages: Array<{ pageKey: string; content: string }> = [];

  try {
    pages = await prisma.pageContent.findMany({
      orderBy: { updatedAt: "desc" },
      take: ADMIN_LIST_LIMIT,
      select: { pageKey: true, content: true },
    });
  } catch (error) {
    console.warn("Pages content unavailable; rendering empty list.", error);
  }
  
  return <PagesClient initialPages={pages} />;
}
