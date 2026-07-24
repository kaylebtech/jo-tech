"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { RevealGroup } from "@/components/shared/reveal";
import { ProductCard, type ProductCardData } from "@/components/product/product-card";
import { ProductQuickView } from "@/components/product/product-quick-view";

export function FeaturedProducts({ products }: { products: ProductCardData[] }) {
  const [quickViewProduct, setQuickViewProduct] = useState<ProductCardData | null>(null);

  if (products.length === 0) return null;

  return (
    <section className="bg-card/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">Featured</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Handpicked This Week
            </h2>
          </div>
          <Button
            variant="ghost"
            className="rounded-full"
            render={
              <Link href="/products">
                View all products
                <ArrowRight className="size-4" />
              </Link>
            }
          />
        </div>

        <Carousel opts={{ align: "start", loop: false }} className="mt-10">
          <RevealGroup>
            <CarouselContent className="-ml-4">
              {products.map((product) => (
                <CarouselItem key={product.id} className="basis-[80%] pl-4 sm:basis-1/2 lg:basis-1/4">
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </RevealGroup>
          <div className="mt-6 flex justify-center gap-2 sm:hidden">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>

      <ProductQuickView
        product={quickViewProduct}
        open={!!quickViewProduct}
        onOpenChange={(open) => !open && setQuickViewProduct(null)}
      />
    </section>
  );
}
