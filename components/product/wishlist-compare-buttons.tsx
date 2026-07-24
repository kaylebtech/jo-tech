"use client";

import { Heart, Scale } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCompare } from "@/hooks/use-compare";

export function WishlistCompareButtons({ productId }: { productId: string }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isComparing, toggleCompare, isFull, maxCompare } = useCompare();
  const wishlisted = isWishlisted(productId);
  const comparing = isComparing(productId);

  return (
    <div className="flex gap-2.5">
      <Button
        variant="outline"
        className={`flex-1 rounded-full ${wishlisted ? "border-destructive/40 text-destructive" : ""}`}
        onClick={() => {
          toggleWishlist(productId);
          toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
        }}
      >
        <Heart className="size-4" fill={wishlisted ? "currentColor" : "none"} />
        {wishlisted ? "Wishlisted" : "Add to Wishlist"}
      </Button>
      <Button
        variant="outline"
        className={`flex-1 rounded-full ${comparing ? "border-primary/40 text-primary" : ""}`}
        onClick={() => {
          if (!comparing && isFull) {
            toast.error(`You can compare up to ${maxCompare} products at a time`);
            return;
          }
          toggleCompare(productId);
          toast.success(comparing ? "Removed from compare" : "Added to compare");
        }}
      >
        <Scale className="size-4" />
        {comparing ? "Comparing" : "Compare"}
      </Button>
    </div>
  );
}
