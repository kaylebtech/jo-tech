import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { GalleryManager } from "@/components/admin/gallery-manager";

export const metadata: Metadata = { title: "Gallery" };

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { position: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Gallery</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage store, product, and repair before/after photos.</p>
      <div className="mt-6">
        <GalleryManager images={images} />
      </div>
    </div>
  );
}
