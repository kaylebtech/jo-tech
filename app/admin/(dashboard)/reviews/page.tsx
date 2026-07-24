import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ReviewsTable } from "@/components/admin/reviews-table";

export const metadata: Metadata = { title: "Reviews" };

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Reviews</h1>
      <p className="mt-1 text-sm text-muted-foreground">Approve or remove customer reviews before they go public.</p>
      <div className="mt-6">
        <ReviewsTable reviews={reviews} />
      </div>
    </div>
  );
}
