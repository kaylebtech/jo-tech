"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

export type GalleryImage = { url: string; altText: string | null };

export function ProductGallery({ images, productName }: { images: GalleryImage[]; productName: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return <div className="aspect-square rounded-2xl bg-muted" />;
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <Image
              src={images[active].url}
              alt={images[active].altText ?? productName}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                active === i ? "border-primary" : "border-transparent hover:border-border"
              }`}
            >
              <Image src={img.url} alt={img.altText ?? productName} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
