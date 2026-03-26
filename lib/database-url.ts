export function hasValidPostgresDatabaseUrl(): boolean {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return false;
  }

  const normalized = databaseUrl.trim().replace(/^['\"]|['\"]$/g, "");

  return normalized.startsWith("postgresql://") || normalized.startsWith("postgres://");
}