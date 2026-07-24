"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { MessageCircle, Eye, Heart, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/constants";
import { revealItemVariants } from "@/components/shared/reveal";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCompare } from "@/hooks/use-compare";
import { toast } from "sonner";

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  price: number | null;
  compareAtPrice: number | null;
  condition: string;
  stockStatus: string;
  images: { url: string; altText: string | null }[];
  category?: { name: string; slug: string } | null;
};

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function formatPrice(price: number | null) {
  if (price === null || Number.isNaN(price)) return null;
  return nairaFormatter.format(price);
}

export function ProductCard({ product, onQuickView }: { product: ProductCardData; onQuickView?: (p: ProductCardData) => void }) {
  const image = product.images[0];
  const price = formatPrice(product.price);
  const compareAt = formatPrice(product.compareAtPrice);
  const outOfStock = product.stockStatus === "OUT_OF_STOCK";
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isComparing, toggleCompare, isFull, maxCompare } = useCompare();
  const wishlisted = isWishlisted(product.id);
  const comparing = isComparing(product.id);

  return (
    <motion.div variants={revealItemVariants} className="group relative">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_48px_-20px_rgba(23,78,166,0.3)]">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-muted">
            {image ? (
              <Image
                src={image.url}
                alt={image.altText ?? product.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
            )}

            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {product.condition === "UK_USED" && <Badge variant="secondary">UK Used</Badge>}
              {product.condition === "REFURBISHED" && <Badge variant="secondary">Refurbished</Badge>}
              {compareAt && <Badge className="bg-success text-success-foreground">Sale</Badge>}
            </div>

            <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
              <Badge
                variant={outOfStock ? "destructive" : "outline"}
                className={outOfStock ? "" : "border-success/30 bg-success/10 text-success"}
              >
                {outOfStock ? "Out of stock" : product.stockStatus === "PREORDER" ? "Pre-order" : "In stock"}
              </Badge>
            </div>

            <div className="absolute left-3 bottom-3 flex flex-col gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <button
                type="button"
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product.id);
                  toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
                }}
                className={`flex size-9 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-colors ${
                  wishlisted ? "bg-destructive text-white" : "bg-background/90 text-foreground hover:bg-background"
                }`}
              >
                <Heart className="size-4" fill={wishlisted ? "currentColor" : "none"} />
              </button>
              <button
                type="button"
                aria-label={comparing ? "Remove from compare" : "Add to compare"}
                onClick={(e) => {
                  e.preventDefault();
                  if (!comparing && isFull) {
                    toast.error(`You can compare up to ${maxCompare} products at a time`);
                    return;
                  }
                  toggleCompare(product.id);
                  toast.success(comparing ? "Removed from compare" : "Added to compare");
                }}
                className={`flex size-9 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-colors ${
                  comparing ? "bg-primary text-primary-foreground" : "bg-background/90 text-foreground hover:bg-background"
                }`}
              >
                <Scale className="size-4" />
              </button>
            </div>

            {onQuickView && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(product);
                }}
                aria-label={`Quick view ${product.name}`}
                className="absolute inset-x-3 bottom-3 flex translate-y-4 items-center justify-center gap-2 rounded-full bg-background/90 py-2.5 text-sm font-medium text-foreground opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
              >
                <Eye className="size-4" />
                Quick View
              </button>
            )}
          </div>
        </Link>

        <div className="p-4">
          {product.brand && <p className="text-xs font-medium text-accent">{product.brand}</p>}
          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-foreground">{product.name}</h3>
          </Link>
          <div className="mt-2 flex items-baseline gap-2">
            {price && <span className="text-base font-semibold text-foreground">{price}</span>}
            {compareAt && <span className="text-xs text-muted-foreground line-through">{compareAt}</span>}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full rounded-full border-success/30 text-success hover:bg-success/10 hover:text-success"
            render={
              <a
                href={whatsappLink(`Hi Jo Tech! I'm interested in the ${product.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle className="size-3.5" />
                WhatsApp Inquiry
              </a>
            }
          />
        </div>
      </div>
    </motion.div>
  );
}
