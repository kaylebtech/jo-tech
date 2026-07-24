"use client";

import { motion } from "motion/react";
import { RevealGroup, revealItemVariants } from "@/components/shared/reveal";

// `icon` is a rendered element (not a component reference) — component
// references can't cross the server->client prop boundary (not serializable).
export type IconFeature = { icon: React.ReactNode; title: string; description: string };

export function IconFeatureGrid({ items, className }: { items: IconFeature[]; className?: string }) {
  return (
    <RevealGroup className={className}>
      {items.map((item) => (
        <motion.div
          key={item.title}
          variants={revealItemVariants}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {item.icon}
          </span>
          <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        </motion.div>
      ))}
    </RevealGroup>
  );
}
