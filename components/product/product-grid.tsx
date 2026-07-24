"use client";

import { useState } from "react";
import { RevealGroup } from "@/components/shared/reveal";
import { ProductCard, type ProductCardData } from "@/components/product/product-card";
import { ProductQuickView } from "@/components/product/product-quick-view";

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  const [quickViewProduct, setQuickViewProduct] = useState<ProductCardData | null>(null);

  return (
    <>
      <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
        ))}
      </RevealGroup>

      <ProductQuickView
        product={quickViewProduct}
        open={!!quickViewProduct}
        onOpenChange={(open) => !open && setQuickViewProduct(null)}
      />
    </>
  );
}
