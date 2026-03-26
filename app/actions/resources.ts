"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "./_auth";

// --- BOOKS ---

export async function getBooks() {
  return await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createBook(formData: FormData) {
  await requireAdminSession();

  await prisma.book.create({
    data: {
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      description: (formData.get("description") as string) || "",
      coverImage: (formData.get("coverImage") as string) || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
      purchaseLink: formData.get("purchaseLink") as string,
      isPublished: formData.get("isPublished") === "true",
      isFeatured: formData.get("isFeatured") === "true",
    },
  });
  revalidatePath("/admin/books");
  revalidatePath("/resources");
}

export async function updateBook(id: string, formData: FormData) {
  await requireAdminSession();

  await prisma.book.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      description: formData.get("description") as string,
      coverImage: formData.get("coverImage") as string,
      purchaseLink: formData.get("purchaseLink") as string,
      isPublished: formData.get("isPublished") === "true",
      isFeatured: formData.get("isFeatured") === "true",
    },
  });
  revalidatePath("/admin/books");
  revalidatePath("/resources");
}

export async function deleteBook(id: string) {
  await requireAdminSession();

  await prisma.book.delete({ where: { id } });
  revalidatePath("/admin/books");
  revalidatePath("/resources");
}

// --- PODCASTS ---

export async function getPodcasts() {
  return await prisma.podcast.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createPodcast(formData: FormData) {
  await requireAdminSession();

  await prisma.podcast.create({
    data: {
      name: formData.get("name") as string,
      host: formData.get("host") as string,
      description: (formData.get("description") as string) || "Spiritual Growth", // using description field as category for now
      coverImage: (formData.get("coverImage") as string) || "https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?q=80&w=800&auto=format&fit=crop",
      link: formData.get("link") as string,
      isPublished: formData.get("isPublished") === "true",
      isFeatured: formData.get("isFeatured") === "true",
    },
  });
  revalidatePath("/admin/podcasts");
  revalidatePath("/resources");
}

export async function updatePodcast(id: string, formData: FormData) {
  await requireAdminSession();

  await prisma.podcast.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      host: formData.get("host") as string,
      description: formData.get("description") as string,
      coverImage: formData.get("coverImage") as string,
      link: formData.get("link") as string,
      isPublished: formData.get("isPublished") === "true",
      isFeatured: formData.get("isFeatured") === "true",
    },
  });
  revalidatePath("/admin/podcasts");
  revalidatePath("/resources");
}

export async function deletePodcast(id: string) {
  await requireAdminSession();

  await prisma.podcast.delete({ where: { id } });
  revalidatePath("/admin/podcasts");
  revalidatePath("/resources");
}

// --- MUSIC ---
export async function getMusic() {
  return await prisma.music.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createMusic(formData: FormData) {
  await requireAdminSession();

  await prisma.music.create({
    data: {
      title: formData.get("title") as string,
      artist: formData.get("artist") as string,
      description: formData.get("description") as string,
      coverImage: formData.get("coverImage") as string,
      link: formData.get("link") as string,
      isPublished: formData.get("isPublished") === "true",
      isFeatured: formData.get("isFeatured") === "true",
    },
  });
  revalidatePath("/admin/music");
  revalidatePath("/resources");
}

export async function updateMusic(id: string, formData: FormData) {
  await requireAdminSession();

  await prisma.music.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      artist: formData.get("artist") as string,
      description: formData.get("description") as string,
      coverImage: formData.get("coverImage") as string,
      link: formData.get("link") as string,
      isPublished: formData.get("isPublished") === "true",
      isFeatured: formData.get("isFeatured") === "true",
    },
  });
  revalidatePath("/admin/music");
  revalidatePath("/resources");
}

export async function deleteMusic(id: string) {
  await requireAdminSession();

  await prisma.music.delete({ where: { id } });
  revalidatePath("/admin/music");
  revalidatePath("/resources");
}

// --- CHARACTERS ---
export async function getCharacters() {
  return await prisma.character.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createCharacter(formData: FormData) {
  await requireAdminSession();

  await prisma.character.create({
    data: {
      name: formData.get("name") as string,
      reference: formData.get("reference") as string,
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      isPublished: formData.get("isPublished") === "true",
      isFeatured: formData.get("isFeatured") === "true",
    },
  });
  revalidatePath("/admin/characters");
  revalidatePath("/resources");
}

export async function updateCharacter(id: string, formData: FormData) {
  await requireAdminSession();

  await prisma.character.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      reference: formData.get("reference") as string,
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      isPublished: formData.get("isPublished") === "true",
      isFeatured: formData.get("isFeatured") === "true",
    },
  });
  revalidatePath("/admin/characters");
  revalidatePath("/resources");
}

export async function deleteCharacter(id: string) {
  await requireAdminSession();

  await prisma.character.delete({ where: { id } });
  revalidatePath("/admin/characters");
  revalidatePath("/resources");
}
