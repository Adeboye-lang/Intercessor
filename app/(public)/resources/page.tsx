import { prisma } from "@/lib/prisma";
import { hasValidPostgresDatabaseUrl } from "@/lib/database-url";
import { getDisclaimer } from "@/app/actions/disclaimers";
import { FOOTER_DISCLAIMER_KEY } from "@/lib/public-site-content";
import ResourcesClient, { type ResourceCollectionStatus } from "./ResourcesClient";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  let books: Awaited<ReturnType<typeof prisma.book.findMany>> = [];
  let podcasts: Awaited<ReturnType<typeof prisma.podcast.findMany>> = [];
  let music: Awaited<ReturnType<typeof prisma.music.findMany>> = [];


  let spotlight: Awaited<ReturnType<typeof prisma.spotlight.findFirst>> = null;
  let booksStatus: ResourceCollectionStatus = "database_not_configured";
  let podcastsStatus: ResourceCollectionStatus = "database_not_configured";

  if (hasValidPostgresDatabaseUrl()) {
    try {
      [books, podcasts, music, spotlight] = await Promise.all([
        prisma.book.findMany({ orderBy: { createdAt: "desc" } }),
        prisma.podcast.findMany({ orderBy: { createdAt: "desc" } }),
        prisma.music.findMany({ orderBy: { createdAt: "desc" } }),


        prisma.spotlight.findFirst({ orderBy: { createdAt: "desc" }, where: { isPublished: true } })
      ]);

      booksStatus = books.length > 0 ? "ready" : "empty";
      podcastsStatus = podcasts.length > 0 ? "ready" : "empty";
    } catch (error) {
      console.warn("Resources data unavailable; rendering empty resource state.", error);
      booksStatus = "database_error";
      podcastsStatus = "database_error";
    }
  }

  let spotlightContent: Array<{ pageKey: string; content: string }> = [];
  try {
    spotlightContent = await prisma.pageContent.findMany({
      where: {
        pageKey: { in: [
          "editor_selection_title", "editor_selection_subtitle", "editor_selection_content",
          "music_spotlight_title", "music_spotlight_subtitle", "music_spotlight_content",
          "playlist_commentary"
        ]}
      }
    });
  } catch(error) {}

  const pageContents = spotlightContent.reduce((acc, curr) => {
    acc[curr.pageKey] = curr.content;
    return acc;
  }, {} as Record<string, string>);

  const disclaimerData = await getDisclaimer(FOOTER_DISCLAIMER_KEY);
  const disclaimer = disclaimerData?.value || null;

  return <ResourcesClient 
    initialBooks={books} 
    pageContents={pageContents} 
    initialPodcasts={podcasts} 
    initialMusic={music}


    booksStatus={booksStatus}
    podcastsStatus={podcastsStatus}
    disclaimer={disclaimer}
    spotlight={spotlight}
  />;
}
