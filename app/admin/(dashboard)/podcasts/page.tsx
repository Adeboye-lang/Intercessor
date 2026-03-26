import PodcastsClient from "@/components/admin/PodcastsClient";
import AdminDatabaseNotice from "@/components/admin/AdminDatabaseNotice";
import { prisma } from "@/lib/prisma";
import { hasValidPostgresDatabaseUrl } from "@/lib/database-url";

export const dynamic = "force-dynamic";
const ADMIN_LIST_LIMIT = 200;

export default async function AdminPodcastsPage() {
  if (!hasValidPostgresDatabaseUrl()) {
    return (
      <AdminDatabaseNotice
        heading="Podcasts are managed from PostgreSQL."
        body="Configure a PostgreSQL DATABASE_URL, run your Prisma migration/setup, and seed the initial catalog. Once the database is ready, admins can add, edit, and remove podcast channels here anytime."
      />
    );
  }

  let podcasts: Awaited<ReturnType<typeof prisma.podcast.findMany>> = [];

  try {
    podcasts = await prisma.podcast.findMany({
      orderBy: { createdAt: "desc" },
      take: ADMIN_LIST_LIMIT,
    });
  } catch (error) {
    console.warn("Podcasts data unavailable; rendering empty list.", error);
  }

  return <PodcastsClient initialPodcasts={podcasts} />;
}
