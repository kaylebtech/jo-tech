import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Review = {
  id: string;
  authorName: string;
  rating: number;
  comment: string | null;
  source: string;
  createdAt: Date;
};

const dateFormatter = new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" });

export function ProductReviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No reviews yet for this product — be the first to buy and share your experience.
      </p>
    );
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="text-3xl font-semibold text-foreground">{avgRating.toFixed(1)}</span>
        <div>
          <div className="flex items-center gap-0.5 text-accent">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`size-4 ${i < Math.round(avgRating) ? "fill-current" : "text-border"}`} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-3 border-b border-border pb-5 last:border-0">
            <Avatar className="size-9 shrink-0">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {review.authorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{review.authorName}</p>
                <span className="text-xs text-muted-foreground">{dateFormatter.format(review.createdAt)}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`size-3 ${i < review.rating ? "fill-current" : "text-border"}`} />
                ))}
              </div>
              {review.comment && <p className="mt-1.5 text-sm text-muted-foreground">{review.comment}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
