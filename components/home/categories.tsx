"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealGroup, revealItemVariants } from "@/components/shared/reveal";
import { getIcon } from "@/lib/icon-map";
import { motion } from "motion/react";

type CategoryItem = {
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  _count: { products: number };
};

export function Categories({ categories }: { categories: CategoryItem[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Shop by category</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Everything You Need, All Genuine
        </h2>
        <p className="mt-4 text-muted-foreground">
          From flagship smartphones to studio-grade laptops — every category, carefully curated.
        </p>
      </Reveal>

      <RevealGroup className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => {
          const Icon = getIcon(cat.icon);
          return (
            <motion.div key={cat.slug} variants={revealItemVariants}>
              <Link
                href={`/category/${cat.slug}`}
                className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_40px_-15px_rgba(23,78,166,0.25)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-6" />
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{cat.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {cat._count.products} {cat._count.products === 1 ? "product" : "products"}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </RevealGroup>
    </section>
  );
}
