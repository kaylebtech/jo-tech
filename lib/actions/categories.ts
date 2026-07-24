"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema, type CategoryInput } from "@/lib/validations/category";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

function revalidatePublicPaths() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/categories");
}

export async function createCategory(input: CategoryInput) {
  await requireAdmin();
  const data = categorySchema.parse(input);

  const maxPosition = await prisma.category.aggregate({ _max: { position: true } });
  const category = await prisma.category.create({
    data: { ...data, position: (maxPosition._max.position ?? -1) + 1 },
  });

  revalidatePublicPaths();
}

export async function updateCategory(id: string, input: CategoryInput) {
  await requireAdmin();
  const data = categorySchema.parse(input);

  const category = await prisma.category.update({ where: { id }, data });

  revalidatePublicPaths();
  revalidatePath(`/category/${category.slug}`);
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    throw new Error(`Cannot delete — ${productCount} product(s) still belong to this category.`);
  }

  await prisma.category.delete({ where: { id } });
  revalidatePublicPaths();
}
