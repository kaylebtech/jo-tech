"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Reveal, RevealGroup, revealItemVariants } from "@/components/shared/reveal";

export type GalleryItem = {
  id: string;
  url: string;
  caption: string | null;
  category: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  "shop-inside": "Inside the Shop",
  "shop-outside": "Storefront",
  products: "Products",
  "repair-before": "Before Repair",
  "repair-after": "After Repair",
};

export function Gallery({ images }: { images: GalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const close = () => setActiveIndex(null);
  const showNext = () => setActiveIndex((i) => (i === null ? null : (i + 1) % images.length));
  const showPrev = () => setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Store Gallery</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Take a Look Inside
        </h2>
      </Reveal>

      <RevealGroup className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <motion.button
            key={img.id}
            variants={revealItemVariants}
            onClick={() => setActiveIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-muted"
          >
            <Image
              src={img.url}
              alt={img.caption ?? "Jo Tech Gadgets Hub"}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/0 to-black/0 p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex items-center gap-1.5 text-xs font-medium text-white">
                <Expand className="size-3.5" />
                {CATEGORY_LABELS[img.category] ?? img.category}
              </span>
            </div>
          </motion.button>
        ))}
      </RevealGroup>

      <Dialog open={activeIndex !== null} onOpenChange={(open) => !open && close()}>
        <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">Gallery image</DialogTitle>
          {activeIndex !== null && (
            <div className="relative">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
                <Image
                  src={images[activeIndex].url}
                  alt={images[activeIndex].caption ?? "Jo Tech Gadgets Hub"}
                  fill
                  className="object-contain"
                />
              </div>
              {images[activeIndex].caption && (
                <p className="mt-3 text-center text-sm text-white">{images[activeIndex].caption}</p>
              )}
              <button
                onClick={close}
                aria-label="Close"
                className="absolute -top-4 -right-4 flex size-9 items-center justify-center rounded-full bg-white text-foreground shadow-lg"
              >
                <X className="size-4" />
              </button>
              <button
                onClick={showPrev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={showNext}
                aria-label="Next image"
                className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
