"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { productSchema, type ProductInput } from "@/lib/validations/product";
import { deleteImage } from "@/lib/cloudinary";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

function revalidateProductPaths(slug?: string, categorySlug?: string) {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  if (slug) revalidatePath(`/products/${slug}`);
  if (categorySlug) revalidatePath(`/category/${categorySlug}`);
}

function specsArrayToObject(specs: { key: string; value: string }[]) {
  const entries = specs.filter((s) => s.key.trim() && s.value.trim());
  return entries.length > 0 ? Object.fromEntries(entries.map((s) => [s.key, s.value])) : null;
}

export async function createProduct(input: ProductInput) {
  await requireAdmin();
  const data = productSchema.parse(input);
  const category = await prisma.category.findUniqueOrThrow({ where: { id: data.categoryId } });

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      brand: data.brand || null,
      price: data.price ?? null,
      compareAtPrice: data.compareAtPrice ?? null,
      categoryId: data.categoryId,
      condition: data.condition,
      stockStatus: data.stockStatus,
      featured: data.featured,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      specs: specsArrayToObject(data.specs) ?? undefined,
      images: {
        create: data.images.map((img, i) => ({ url: img.url, publicId: img.publicId, position: i })),
      },
    },
  });

  revalidateProductPaths(product.slug, category.slug);
}

export async function updateProduct(id: string, input: ProductInput) {
  await requireAdmin();
  const data = productSchema.parse(input);
  const category = await prisma.category.findUniqueOrThrow({ where: { id: data.categoryId } });

  const existing = await prisma.product.findUniqueOrThrow({ where: { id }, include: { images: true } });

  const keepPublicIds = new Set(data.images.map((img) => img.publicId));
  const removedImages = existing.images.filter((img) => !keepPublicIds.has(img.publicId));

  const product = await prisma.$transaction(async (tx) => {
    // No compound unique constraint on (productId, publicId) — simplest correct
    // sync is to drop all rows and recreate from the submitted list in order.
    await tx.productImage.deleteMany({ where: { productId: id } });
    await tx.productImage.createMany({
      data: data.images.map((img, i) => ({ productId: id, url: img.url, publicId: img.publicId, position: i })),
    });

    return tx.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        brand: data.brand || null,
        price: data.price ?? null,
        compareAtPrice: data.compareAtPrice ?? null,
        categoryId: data.categoryId,
        condition: data.condition,
        stockStatus: data.stockStatus,
        featured: data.featured,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        specs: specsArrayToObject(data.specs) ?? undefined,
      },
    });
  });

  for (const img of removedImages) {
    await deleteImage(img.publicId).catch(() => {});
  }

  revalidateProductPaths(existing.slug, category.slug);
  if (product.slug !== existing.slug) revalidateProductPaths(product.slug, category.slug);
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const product = await prisma.product.findUniqueOrThrow({ where: { id }, include: { images: true, category: true } });

  await prisma.product.delete({ where: { id } });
  for (const img of product.images) {
    await deleteImage(img.publicId).catch(() => {});
  }

  revalidateProductPaths(product.slug, product.category.slug);
}
