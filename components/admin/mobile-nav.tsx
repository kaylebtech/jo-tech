"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, LogOut, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ADMIN_NAV } from "@/components/admin/sidebar";
import { SITE_NAME } from "@/lib/constants";

export function AdminMobileNav({ adminName }: { adminName?: string | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Smartphone className="size-4" />
        </span>
        <p className="text-sm font-semibold text-foreground">{SITE_NAME} Admin</p>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Open admin menu">
              <Menu className="size-5" />
            </Button>
          }
        />
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <nav className="flex h-full flex-col p-3">
            <div className="flex-1 space-y-0.5">
              {ADMIN_NAV.map((item) => {
                const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-muted"
                    }`}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-border pt-3">
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                <LogOut className="size-4" />
                Sign Out
              </button>
              {adminName && <p className="px-3 pt-2 text-xs text-muted-foreground">Signed in as {adminName}</p>}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
