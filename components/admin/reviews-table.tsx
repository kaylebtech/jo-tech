"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { setReviewApproval, deleteReview } from "@/lib/actions/reviews";

type ReviewRow = {
  id: string;
  authorName: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  source: string;
  product: { name: string } | null;
};

export function ReviewsTable({ reviews }: { reviews: ReviewRow[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<ReviewRow | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">{review.authorName}</TableCell>
                <TableCell className="text-muted-foreground">{review.product?.name ?? "—"}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-0.5 text-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`size-3.5 ${i < review.rating ? "fill-current" : "text-border"}`} />
                    ))}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">{review.comment}</TableCell>
                <TableCell>
                  <Badge
                    variant={review.approved ? "outline" : "secondary"}
                    className={review.approved ? "border-success/30 bg-success/10 text-success" : ""}
                  >
                    {review.approved ? "Approved" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={review.approved ? "Unapprove" : "Approve"}
                    onClick={async () => {
                      await setReviewApproval(review.id, !review.approved);
                      toast.success(review.approved ? "Review unapproved" : "Review approved");
                      router.refresh();
                    }}
                  >
                    {review.approved ? <X className="size-4" /> : <Check className="size-4 text-success" />}
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setDeleteTarget(review)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {reviews.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No reviews yet.</p>}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this review?"
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteReview(deleteTarget.id);
          toast.success("Review deleted");
          router.refresh();
        }}
      />
    </>
  );
}
