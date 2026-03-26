import AboutClient from "./AboutClient";
import { prisma } from "@/lib/prisma";
import { hasValidPostgresDatabaseUrl } from "@/lib/database-url";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  let pageContents: Array<{ pageKey: string; content: string }> = [];

  if (hasValidPostgresDatabaseUrl()) {
    try {
      pageContents = await prisma.pageContent.findMany({
        select: { pageKey: true, content: true },
      });
    } catch (error) {
      console.warn("About content unavailable; rendering default content.", error);
    }
  }

  const dbContent = pageContents.reduce((acc: Record<string, string>, curr) => {
    acc[curr.pageKey] = curr.content;
    return acc;
  }, {} as Record<string, string>);

  return <AboutClient dbContent={dbContent} />;
}
