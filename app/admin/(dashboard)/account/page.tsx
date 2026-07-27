import type { Metadata } from "next";
import { auth } from "@/auth";
import { ChangePasswordForm } from "@/components/admin/change-password-form";

export const metadata: Metadata = { title: "My Account" };

export default async function AdminAccountPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">My Account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Signed in as {session?.user.email} ({session?.user.role === "SUPER_ADMIN" ? "Super Admin" : "Staff"})
      </p>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-semibold text-foreground">Change Password</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
