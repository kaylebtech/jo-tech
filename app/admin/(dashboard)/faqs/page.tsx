import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FAQsTable } from "@/components/admin/faqs-table";

export const metadata: Metadata = { title: "FAQs" };

export default async function AdminFAQsPage() {
  const faqs = await prisma.fAQ.findMany({ orderBy: { position: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">FAQs</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage frequently asked questions shown on the site.</p>
      <div className="mt-6">
        <FAQsTable faqs={faqs} />
      </div>
    </div>
  );
}
