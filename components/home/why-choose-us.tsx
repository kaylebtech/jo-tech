"use client";

import { ShieldCheck, BadgePercent, Repeat, Wrench, Truck, Headset, Award } from "lucide-react";
import { Reveal, RevealGroup, revealItemVariants } from "@/components/shared/reveal";
import { motion } from "motion/react";

const REASONS = [
  { icon: Award, title: "Authentic Products", description: "Every device is 100% genuine, sourced and verified before it reaches our shelves." },
  { icon: ShieldCheck, title: "Warranty Backed", description: "Buy with confidence — every purchase is covered by a clear warranty period." },
  { icon: BadgePercent, title: "Affordable Prices", description: "Competitive, transparent pricing with no hidden charges, ever." },
  { icon: Repeat, title: "Trade-In Program", description: "Swap your old device toward a new one — fast, fair valuations on the spot." },
  { icon: Wrench, title: "Expert Repairs", description: "In-house technicians handle screens, batteries, and more — most same-day." },
  { icon: Truck, title: "Fast Delivery", description: "Same-day delivery across Lagos, secure nationwide shipping to every state." },
  { icon: Headset, title: "Professional Support", description: "Real humans on WhatsApp, ready to help before and after your purchase." },
];

export function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Why Jo Tech</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Built on Trust, Backed by Service
        </h2>
      </Reveal>

      <RevealGroup className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map((reason) => (
          <motion.div
            key={reason.title}
            variants={revealItemVariants}
            className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <reason.icon className="size-5" />
            </span>
            <h3 className="mt-4 font-semibold text-foreground">{reason.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{reason.description}</p>
          </motion.div>
        ))}
      </RevealGroup>
    </section>
  );
}
