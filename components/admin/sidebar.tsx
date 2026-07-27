"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MessageSquareText,
  Star,
  Newspaper,
  HelpCircle,
  Images,
  Settings,
  Users,
  UserCircle,
  LogOut,
  ExternalLink,
  Smartphone,
} from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import type { AdminRole } from "@/lib/generated/prisma/client";

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, superAdminOnly: false },
  { href: "/admin/products", label: "Products", icon: Package, superAdminOnly: false },
  { href: "/admin/categories", label: "Categories", icon: FolderTree, superAdminOnly: true },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquareText, superAdminOnly: false },
  { href: "/admin/reviews", label: "Reviews", icon: Star, superAdminOnly: false },
  { href: "/admin/blog", label: "Blog Posts", icon: Newspaper, superAdminOnly: false },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, superAdminOnly: false },
  { href: "/admin/gallery", label: "Gallery", icon: Images, superAdminOnly: false },
  { href: "/admin/settings", label: "Site Settings", icon: Settings, superAdminOnly: true },
  { href: "/admin/staff", label: "Staff", icon: Users, superAdminOnly: true },
  { href: "/admin/account", label: "My Account", icon: UserCircle, superAdminOnly: false },
];

export function AdminSidebar({ adminName, role }: { adminName?: string | null; role: AdminRole }) {
  const pathname = usePathname();
  const navItems = ADMIN_NAV.filter((item) => !item.superAdminOnly || role === "SUPER_ADMIN");

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Smartphone className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{SITE_NAME}</p>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-muted"
              }`}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-0.5 border-t border-border p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted"
        >
          <ExternalLink className="size-4" />
          View Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          Sign Out
        </button>
        {adminName && <p className="px-3 pt-2 text-xs text-muted-foreground">Signed in as {adminName}</p>}
      </div>
    </aside>
  );
}
