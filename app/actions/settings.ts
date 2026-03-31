"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "./_auth";

export async function updateSetting(key: string, value: string, description?: string) {
  await requireAdminSession();

  await prisma.siteSetting.upsert({
    where: { key },
    update: { value, description },
    create: { key, value, description }
  });
  revalidatePath("/", "layout");
}

export async function updatePageContent(pageKey: string, content: string) {
  await requireAdminSession();

  await prisma.pageContent.upsert({
    where: { pageKey },
    update: { content },
    create: { pageKey, content }
  });
  revalidatePath("/", "layout");
}
