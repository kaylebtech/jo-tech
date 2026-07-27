import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CategoriesTable } from "@/components/admin/categories-table";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const session = await auth();
  if (session?.user.role !== "SUPER_ADMIN") redirect("/admin");

  const categories = await prisma.category.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your product categories.</p>
        </div>
      </div>
      <div className="mt-6">
        <CategoriesTable categories={categories} />
      </div>
    </div>
  );
}
