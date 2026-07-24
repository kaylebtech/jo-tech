"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/cloudinary";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

const GALLERY_CATEGORIES = ["shop-inside", "shop-outside", "products", "repair-before", "repair-after"] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export async function addGalleryImage(input: { url: string; publicId: string; category: GalleryCategory; caption?: string }) {
  await requireAdmin();
  const maxPosition = await prisma.galleryImage.aggregate({ _max: { position: true } });
  await prisma.galleryImage.create({
    data: { ...input, caption: input.caption || null, position: (maxPosition._max.position ?? -1) + 1 },
  });
  revalidatePath("/");
  revalidatePath("/admin/gallery");
}

export async function deleteGalleryImage(id: string) {
  await requireAdmin();
  const image = await prisma.galleryImage.delete({ where: { id } });
  await deleteImage(image.publicId).catch(() => {});
  revalidatePath("/");
  revalidatePath("/admin/gallery");
}
