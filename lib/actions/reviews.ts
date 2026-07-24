"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

export async function setReviewApproval(id: string, approved: boolean) {
  await requireAdmin();
  const review = await prisma.review.update({ where: { id }, data: { approved }, include: { product: true } });
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  if (review.product) revalidatePath(`/products/${review.product.slug}`);
}

export async function deleteReview(id: string) {
  await requireAdmin();
  const review = await prisma.review.delete({ where: { id }, include: { product: true } });
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  if (review.product) revalidatePath(`/products/${review.product.slug}`);
}
