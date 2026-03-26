import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { hasValidPostgresDatabaseUrl } from "@/lib/database-url";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://intercessor.uk";

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/belong`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  // Dynamic routes from database
  let books: Array<{ id: string; updatedAt: Date; isPublished: boolean }> = [];
  let podcasts: Array<{ id: string; updatedAt: Date; isPublished: boolean }> = [];
  let music: Array<{ id: string; updatedAt: Date; isPublished: boolean }> = [];
  let events: Array<{ id: string; updatedAt: Date; isPublished: boolean }> = [];

  if (hasValidPostgresDatabaseUrl()) {
    try {
      [books, podcasts, music, events] = await Promise.all([
        prisma.book.findMany({ select: { id: true, updatedAt: true, isPublished: true } }),
        prisma.podcast.findMany({ select: { id: true, updatedAt: true, isPublished: true } }),
        prisma.music.findMany({ select: { id: true, updatedAt: true, isPublished: true } }),
        prisma.event.findMany({ select: { id: true, updatedAt: true, isPublished: true } }),
      ]);
    } catch (error) {
      console.warn("Sitemap database routes unavailable; serving static routes only.", error);
    }
  } else {
    console.warn("Sitemap database routes skipped: DATABASE_URL is not configured for PostgreSQL.");
  }

  const bookRoutes = books
    .filter((b) => b.isPublished)
    .map((book) => ({
      url: `${baseUrl}/resources#book-${book.id}`,
      lastModified: book.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const podcastRoutes = podcasts
    .filter((p) => p.isPublished)
    .map((podcast) => ({
      url: `${baseUrl}/resources#podcast-${podcast.id}`,
      lastModified: podcast.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const musicRoutes = music
    .filter((m) => m.isPublished)
    .map((track) => ({
      url: `${baseUrl}/resources#music-${track.id}`,
      lastModified: track.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  const eventRoutes = events
    .filter((e) => e.isPublished)
    .map((event) => ({
      url: `${baseUrl}/belong#event-${event.id}`,
      lastModified: event.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...bookRoutes, ...podcastRoutes, ...musicRoutes, ...eventRoutes];
}
