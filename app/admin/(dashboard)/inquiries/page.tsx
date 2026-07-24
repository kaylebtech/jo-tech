import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { InquiriesTable } from "@/components/admin/inquiries-table";

export const metadata: Metadata = { title: "Inquiries" };

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true, slug: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Inquiries</h1>
      <p className="mt-1 text-sm text-muted-foreground">Buy, sell, swap and repair leads from WhatsApp and the site.</p>
      <div className="mt-6">
        <InquiriesTable inquiries={inquiries} />
      </div>
    </div>
  );
}
