"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session;
}