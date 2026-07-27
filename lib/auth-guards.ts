import "server-only";
import { auth } from "@/auth";

/** Any logged-in admin or staff account. Use for day-to-day CRUD (products, inquiries, reviews, blog, FAQs, gallery). */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

/** Super Admin only. Use for anything site-wide or security-sensitive: Site Settings, Categories, Staff Management. */
export async function requireSuperAdmin() {
  const session = await requireAdmin();
  if (session.user.role !== "SUPER_ADMIN") {
    throw new Error("Only a Super Admin can do this.");
  }
  return session;
}
