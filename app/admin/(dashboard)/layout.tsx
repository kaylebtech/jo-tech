import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminMobileNav } from "@/components/admin/mobile-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <div className="hidden lg:block">
        <AdminSidebar adminName={session.user.name ?? session.user.email} role={session.user.role} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileNav adminName={session.user.name ?? session.user.email} role={session.user.role} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
