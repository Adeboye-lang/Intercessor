"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "./_auth";

// --- EVENTS ---

export async function getEvents() {
  return await prisma.event.findMany({
    orderBy: { eventDate: "asc" },
  });
}

export async function createEvent(formData: FormData) {
  await requireAdminSession();

  const dateStr = formData.get("eventDate") as string;
  const eventDate = dateStr ? new Date(dateStr) : new Date();

  await prisma.event.create({
    data: {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image: (formData.get("image") as string) || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
      eventDate: eventDate,
      time: formData.get("time") as string,
      location: formData.get("location") as string,
      registrationLink: formData.get("registrationLink") as string,
      isPublished: formData.get("isPublished") === "true",
      isFeatured: formData.get("isFeatured") === "true",
    },
  });
  revalidatePath("/admin/events");
  revalidatePath("/belong");
}

export async function updateEvent(id: string, formData: FormData) {
  await requireAdminSession();

  const dateStr = formData.get("eventDate") as string;
  const eventDate = dateStr ? new Date(dateStr) : new Date();

  await prisma.event.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      eventDate: eventDate,
      time: formData.get("time") as string,
      location: formData.get("location") as string,
      registrationLink: formData.get("registrationLink") as string,
      isPublished: formData.get("isPublished") === "true",
      isFeatured: formData.get("isFeatured") === "true",
    },
  });
  revalidatePath("/admin/events");
  revalidatePath("/belong");
}

export async function deleteEvent(id: string) {
  await requireAdminSession();

  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/belong");
}

// --- SPOTLIGHT ---

export async function getSpotlights() {
  return await prisma.spotlight.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createSpotlight(formData: FormData) {
  await requireAdminSession();

  await prisma.spotlight.create({
    data: {
      title: formData.get("title") as string,
      type: formData.get("type") as string,
      description: formData.get("description") as string,
      image: (formData.get("image") as string) || "https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?q=80",
      link: formData.get("link") as string,
      isPublished: formData.get("isPublished") === "true",
    },
  });
  revalidatePath("/admin/spotlight");
  revalidatePath("/(public)/resources");
  revalidatePath("/resources");
}

export async function updateSpotlight(id: string, formData: FormData) {
  await requireAdminSession();

  await prisma.spotlight.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      type: formData.get("type") as string,
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      link: formData.get("link") as string,
      isPublished: formData.get("isPublished") === "true",
    },
  });
  revalidatePath("/admin/spotlight");
  revalidatePath("/(public)/resources");
  revalidatePath("/resources");
}

export async function deleteSpotlight(id: string) {
  await requireAdminSession();

  await prisma.spotlight.delete({ where: { id } });
  revalidatePath("/admin/spotlight");
  revalidatePath("/(public)/resources");
  revalidatePath("/resources");
}
