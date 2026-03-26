import { prisma } from "@/lib/prisma";
import { hasValidPostgresDatabaseUrl } from "@/lib/database-url";
import SettingsClient from "@/components/admin/SettingsClient";

export const revalidate = 0;
const ADMIN_LIST_LIMIT = 200;

export default async function SettingsPage() {
  if (!hasValidPostgresDatabaseUrl()) {
    return <SettingsClient initialSettings={[]} />;
  }

  let settings: Array<{ key: string; value: string }> = [];

  try {
    settings = await prisma.siteSetting.findMany({
      orderBy: { updatedAt: "desc" },
      take: ADMIN_LIST_LIMIT,
      select: { key: true, value: true },
    });
  } catch (error) {
    console.warn("Settings data unavailable; rendering empty settings.", error);
  }
  
  return <SettingsClient initialSettings={settings} />;
}
