"use server";

import { prisma } from "@/lib/prisma";
import { hasValidPostgresDatabaseUrl } from "@/lib/database-url";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "./_auth";
import { isManagedSiteSettingKey } from "@/lib/public-site-content";

const PUBLIC_SITE_PATHS = [
  "/",
  "/about",
  "/belong",
  "/contact",
  "/resources",
  "/privacy",
  "/terms",
];

function normalizeManagedSiteSettingKey(key: string) {
  const normalizedKey = key.trim();

  if (!normalizedKey) {
    throw new Error("Key is required");
  }

  if (!isManagedSiteSettingKey(normalizedKey)) {
    throw new Error("Key must start with disclaimer_ or legal_");
  }

  return normalizedKey;
}

function revalidateManagedSiteContentPaths() {
  revalidatePath("/admin/disclaimers");

  for (const path of PUBLIC_SITE_PATHS) {
    revalidatePath(path);
  }
}

export async function getDisclaimer(key: string) {
  if (!hasValidPostgresDatabaseUrl()) {
    return null;
  }

  try {
    return await prisma.siteSetting.findUnique({
      where: { key }
    });
  } catch (error) {
    console.error(`Error fetching disclaimer with key ${key}:`, error);
    return null;
  }
}

export async function updateDisclaimer(key: string, formData: FormData) {
  try {
    await requireAdminSession();

    const normalizedKey = normalizeManagedSiteSettingKey(key);
    const value = (formData.get("content") as string | null)?.trim() || "";
    const description = (formData.get("description") as string | null)?.trim() || "";

    if (!value) {
      throw new Error("Disclaimer content is required");
    }

    await prisma.siteSetting.upsert({
      where: { key: normalizedKey },
      update: { value, description },
      create: { 
        key: normalizedKey, 
        value, 
        description: description || "Site disclaimer or legal content"
      }
    });

    revalidateManagedSiteContentPaths();

    return { success: true };
  } catch (error) {
    console.error("Error updating disclaimer:", error);
    throw error;
  }
}

export async function getAllDisclaimers() {
  if (!hasValidPostgresDatabaseUrl()) {
    return [];
  }

  try {
    return await prisma.siteSetting.findMany({
      where: {
        OR: [
          {
            key: {
              startsWith: "disclaimer_"
            }
          },
          {
            key: {
              startsWith: "legal_"
            }
          },
        ],
      },
      orderBy: { updatedAt: "desc" }
    });
  } catch (error) {
    console.error("Error fetching disclaimers:", error);
    return [];
  }
}

export async function createDisclaimer(formData: FormData) {
  try {
    await requireAdminSession();

    const key = normalizeManagedSiteSettingKey((formData.get("key") as string | null) || "");
    const value = (formData.get("content") as string | null)?.trim() || "";
    const description = (formData.get("description") as string | null)?.trim() || "";

    if (!key || !value) {
      throw new Error("Key and content are required");
    }

    const existing = await prisma.siteSetting.findUnique({
      where: { key }
    });

    if (existing) {
      throw new Error("A disclaimer with this key already exists");
    }

    await prisma.siteSetting.create({
      data: {
        key,
        value,
        description
      }
    });

    revalidateManagedSiteContentPaths();
    return { success: true };
  } catch (error) {
    console.error("Error creating disclaimer:", error);
    throw error;
  }
}

export async function deleteDisclaimer(key: string) {
  try {
    await requireAdminSession();
    const normalizedKey = normalizeManagedSiteSettingKey(key);

    await prisma.siteSetting.delete({
      where: { key: normalizedKey }
    });

    revalidateManagedSiteContentPaths();

    return { success: true };
  } catch (error) {
    console.error("Error deleting disclaimer:", error);
    throw error;
  }
}
