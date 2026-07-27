"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireSuperAdmin } from "@/lib/auth-guards";
import { createStaffSchema, changePasswordSchema, type CreateStaffInput, type ChangePasswordInput } from "@/lib/validations/staff";

export async function createStaffAccount(input: CreateStaffInput) {
  await requireSuperAdmin();
  const data = createStaffSchema.parse(input);

  const existing = await prisma.adminUser.findUnique({ where: { email: data.email } });
  if (existing) throw new Error("An account with this email already exists.");

  const passwordHash = await bcrypt.hash(data.password, 12);
  await prisma.adminUser.create({
    data: { name: data.name, email: data.email, passwordHash, role: data.role },
  });

  revalidatePath("/admin/staff");
}

export async function deleteStaffAccount(id: string) {
  const session = await requireSuperAdmin();

  if (session.user.id === id) {
    throw new Error("You can't remove your own account.");
  }

  const target = await prisma.adminUser.findUniqueOrThrow({ where: { id } });
  if (target.role === "SUPER_ADMIN") {
    const superAdminCount = await prisma.adminUser.count({ where: { role: "SUPER_ADMIN" } });
    if (superAdminCount <= 1) {
      throw new Error("Can't remove the last Super Admin account.");
    }
  }

  await prisma.adminUser.delete({ where: { id } });
  revalidatePath("/admin/staff");
}

/** Any logged-in admin or staff account changing their own password. */
export async function changeOwnPassword(input: ChangePasswordInput) {
  const session = await requireAdmin();
  const data = changePasswordSchema.parse(input);

  const user = await prisma.adminUser.findUniqueOrThrow({ where: { id: session.user.id } });
  const valid = await bcrypt.compare(data.currentPassword, user.passwordHash);
  if (!valid) throw new Error("Current password is incorrect.");

  const passwordHash = await bcrypt.hash(data.newPassword, 12);
  await prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash } });
}
