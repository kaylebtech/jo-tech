import type { Metadata } from "next";
import { Suspense } from "react";
import { Smartphone } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Smartphone className="size-6" />
          </span>
          <h1 className="mt-4 text-xl font-semibold text-foreground">{SITE_NAME}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to the admin dashboard</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
