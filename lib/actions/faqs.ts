"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { faqSchema, type FAQInput } from "@/lib/validations/faq";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

function revalidateFaqPaths() {
  revalidatePath("/");
  revalidatePath("/faq");
  revalidatePath("/admin/faqs");
}

export async function createFAQ(input: FAQInput) {
  await requireAdmin();
  const data = faqSchema.parse(input);
  const maxPosition = await prisma.fAQ.aggregate({ _max: { position: true } });
  await prisma.fAQ.create({ data: { ...data, position: (maxPosition._max.position ?? -1) + 1 } });
  revalidateFaqPaths();
}

export async function updateFAQ(id: string, input: FAQInput) {
  await requireAdmin();
  const data = faqSchema.parse(input);
  await prisma.fAQ.update({ where: { id }, data });
  revalidateFaqPaths();
}

export async function deleteFAQ(id: string) {
  await requireAdmin();
  await prisma.fAQ.delete({ where: { id } });
  revalidateFaqPaths();
}
