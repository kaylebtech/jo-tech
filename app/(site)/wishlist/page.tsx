"use client";

import { Heart, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { RevealGroup } from "@/components/shared/reveal";
import { EmptyState } from "@/components/shared/empty-state";
import { useWishlist } from "@/hooks/use-wishlist";
import { useProductsByIds } from "@/hooks/use-products-by-ids";

export default function WishlistPage() {
  const { wishlist, hydrated } = useWishlist();
  const { data, isLoading } = useProductsByIds(wishlist);
  const products = data?.results ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Your Wishlist</h1>
      <p className="mt-2 text-muted-foreground">Devices you've saved for later.</p>

      {!hydrated || (isLoading && wishlist.length > 0) ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : wishlist.length === 0 ? (
        <EmptyState
          icon={<Heart className="size-8 text-muted-foreground" />}
          title="Your wishlist is empty"
          description="Tap the heart icon on any product to save it here."
        />
      ) : (
        <RevealGroup className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </RevealGroup>
      )}
    </div>
  );
}
