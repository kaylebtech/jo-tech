import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm, type ProductFormInitial } from "@/components/admin/product-form";

export const metadata: Metadata = { title: "Edit Product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: { orderBy: { position: "asc" } } } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const specsObj = (product.specs as Record<string, string> | null) ?? {};

  const initial: ProductFormInitial = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    brand: product.brand ?? "",
    price: product.price ? Number(product.price) : undefined,
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
    categoryId: product.categoryId,
    condition: product.condition,
    stockStatus: product.stockStatus,
    featured: product.featured,
    metaTitle: product.metaTitle ?? "",
    metaDescription: product.metaDescription ?? "",
    images: product.images.map((img) => ({ url: img.url, publicId: img.publicId })),
    specs: Object.entries(specsObj).map(([key, value]) => ({ key, value })),
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Edit Product</h1>
      <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
      <div className="mt-6">
        <ProductForm initial={initial} categories={categories} />
      </div>
    </div>
  );
}
