import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductsTable } from "@/components/admin/products-table";
import { serializeProduct } from "@/lib/serialize";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, images: { orderBy: { position: "asc" }, take: 1 } },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Products</h1>
      <p className="mt-1 text-sm text-muted-foreground">{products.length} products in your catalog.</p>
      <div className="mt-6">
        <ProductsTable products={products.map(serializeProduct)} />
      </div>
    </div>
  );
}
