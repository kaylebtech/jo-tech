"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/constants";
import type { ProductCardData } from "@/components/product/product-card";
import { useWhatsappNumber } from "@/components/providers/whatsapp-provider";

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function ProductQuickView({
  product,
  open,
  onOpenChange,
}: {
  product: ProductCardData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const whatsappNumber = useWhatsappNumber();
  if (!product) return null;
  const image = product.images[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <DialogDescription className="sr-only">Quick view of {product.name}</DialogDescription>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="relative aspect-square bg-muted sm:aspect-auto sm:min-h-[420px]">
            {image && (
              <Image src={image.url} alt={image.altText ?? product.name} fill className="object-cover" />
            )}
          </div>
          <div className="flex flex-col p-6">
            {product.brand && <p className="text-xs font-medium text-accent">{product.brand}</p>}
            <h2 className="mt-1 text-xl font-semibold text-foreground">{product.name}</h2>
            <div className="mt-2 flex items-center gap-2">
              {product.condition === "UK_USED" && <Badge variant="secondary">UK Used</Badge>}
              <Badge
                variant={product.stockStatus === "OUT_OF_STOCK" ? "destructive" : "outline"}
                className={product.stockStatus === "OUT_OF_STOCK" ? "" : "border-success/30 bg-success/10 text-success"}
              >
                {product.stockStatus === "OUT_OF_STOCK" ? "Out of stock" : "In stock"}
              </Badge>
            </div>
            {product.price !== null && (
              <p className="mt-4 text-2xl font-semibold text-foreground">
                {nairaFormatter.format(product.price)}
              </p>
            )}
            <div className="mt-auto flex flex-col gap-2.5 pt-6">
              <Button
                className="w-full rounded-full border-success/30 bg-success text-success-foreground hover:bg-success/90"
                render={
                  <a
                    href={whatsappLink(`Hi Jo Tech! I'm interested in the ${product.name}.`, whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="size-4" />
                    WhatsApp Inquiry
                  </a>
                }
              />
              <Button
                variant="outline"
                className="w-full rounded-full"
                render={
                  <Link href={`/products/${product.slug}`}>
                    View Full Details
                    <ArrowRight className="size-4" />
                  </Link>
                }
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
