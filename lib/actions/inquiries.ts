"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

export async function updateInquiryStatus(id: string, status: "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED") {
  await requireAdmin();
  await prisma.inquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

export async function deleteInquiry(id: string) {
  await requireAdmin();
  await prisma.inquiry.delete({ where: { id } });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}
