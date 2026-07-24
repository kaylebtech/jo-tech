import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = { title: "New Product" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">New Product</h1>
      <p className="mt-1 text-sm text-muted-foreground">Add a new product to your catalog.</p>
      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
