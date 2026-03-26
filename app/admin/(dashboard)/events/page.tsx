import EventsClient from "@/components/admin/EventsClient";
import { prisma } from "@/lib/prisma";
import { hasValidPostgresDatabaseUrl } from "@/lib/database-url";

export const dynamic = "force-dynamic";
const ADMIN_LIST_LIMIT = 200;

export default async function AdminEventsPage() {
  if (!hasValidPostgresDatabaseUrl()) {
    return <EventsClient initialEvents={[]} />;
  }

  let events: Awaited<ReturnType<typeof prisma.event.findMany>> = [];

  try {
    events = await prisma.event.findMany({
      orderBy: { eventDate: "asc" },
      take: ADMIN_LIST_LIMIT,
    });
  } catch (error) {
    console.warn("Events data unavailable; rendering empty list.", error);
  }

  return <EventsClient initialEvents={events} />;
}
