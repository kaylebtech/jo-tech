import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { StaffTable } from "@/components/admin/staff-table";
import { NewStaffDialog } from "@/components/admin/staff-form";

export const metadata: Metadata = { title: "Staff" };

export default async function AdminStaffPage() {
  const session = await auth();
  if (session?.user.role !== "SUPER_ADMIN") redirect("/admin");

  const staff = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Staff</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage who can access the admin dashboard.</p>
        </div>
        <NewStaffDialog />
      </div>
      <div className="mt-6">
        <StaffTable staff={staff} currentUserId={session.user.id} />
      </div>
    </div>
  );
}
