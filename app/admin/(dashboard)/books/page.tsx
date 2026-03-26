import BooksClient from "@/components/admin/BooksClient";
import AdminDatabaseNotice from "@/components/admin/AdminDatabaseNotice";
import { prisma } from "@/lib/prisma";
import { hasValidPostgresDatabaseUrl } from "@/lib/database-url";

export const dynamic = "force-dynamic";
const ADMIN_LIST_LIMIT = 200;

export default async function AdminBooksPage() {
  if (!hasValidPostgresDatabaseUrl()) {
    return (
      <AdminDatabaseNotice
        heading="Books are managed from PostgreSQL."
        body="Configure a PostgreSQL DATABASE_URL, run your Prisma migration/setup, and seed the initial catalog. Once the database is ready, admins can add, edit, and remove books here anytime."
      />
    );
  }

  let books: Awaited<ReturnType<typeof prisma.book.findMany>> = [];

  try {
    books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
      take: ADMIN_LIST_LIMIT,
    });
  } catch (error) {
    console.warn("Books data unavailable; rendering empty list.", error);
  }

  return <BooksClient initialBooks={books} />;
}
