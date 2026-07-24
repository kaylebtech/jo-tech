import type { Metadata } from "next";
import Link from "next/link";
import { Package, MessageSquareText, Star, Newspaper, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const [productCount, newInquiries, pendingReviews, publishedPosts, recentInquiries] = await Promise.all([
    prisma.product.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.review.count({ where: { approved: false } }),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { product: { select: { name: true, slug: true } } },
    }),
  ]);

  const stats = [
    { label: "Products", value: productCount, icon: Package, href: "/admin/products" },
    { label: "New Inquiries", value: newInquiries, icon: MessageSquareText, href: "/admin/inquiries" },
    { label: "Pending Reviews", value: pendingReviews, icon: Star, href: "/admin/reviews" },
    { label: "Published Posts", value: publishedPosts, icon: Newspaper, href: "/admin/blog" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">An overview of your store.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <stat.icon className="size-5" />
              </span>
              <ArrowRight className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-4 text-2xl font-semibold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-semibold text-foreground">Recent Inquiries</h2>
          <Link href="/admin/inquiries" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        {recentInquiries.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No inquiries yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="flex items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{inquiry.customerName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {inquiry.type} · {inquiry.product?.name ?? "General inquiry"} · {inquiry.customerPhone}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground/80">
                  {inquiry.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
