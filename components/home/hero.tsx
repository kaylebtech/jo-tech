"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { ArrowRight, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroDevices } from "@/components/home/hero-devices";
import { whatsappLink } from "@/lib/constants";

// Animate transform only (never opacity) — this is above-the-fold hero content
// and is consistently the page's LCP candidate. An opacity:0 initial state
// makes Chrome treat it as unpainted until the animation resolves, which
// pushed LCP out by several seconds under CPU throttling. A transform-only
// slide keeps the motion without ever hiding the pixels.
const fadeUp: Variants = {
  hidden: { y: 16 },
  visible: (i: number = 0) => ({
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.21, 0.47, 0.32, 0.98] as const },
  }),
};

export function Hero({ googleRating }: { googleRating?: number | null }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.718_0.11_239.8_/_12%),transparent)]" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="text-center lg:text-left">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm"
          >
            <span className="flex size-1.5 rounded-full bg-success" />
            Verified store in Mosafejo, Lagos
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Nigeria&apos;s Trusted{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Gadget Marketplace
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-lg font-medium text-foreground/80 lg:justify-start"
          >
            <span>Buy</span>
            <Dot />
            <span>Sell</span>
            <Dot />
            <span>Swap</span>
            <Dot />
            <span>Repair</span>
          </motion.p>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground lg:mx-0"
          >
            Genuine brand new and carefully tested UK-used smartphones, laptops, smart watches,
            AirPods, speakers and accessories — every device backed by warranty, every
            transaction backed by trust.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={4}
            variants={fadeUp}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Button
              size="lg"
              className="h-12 w-full rounded-full px-8 text-base sm:w-auto"
              render={
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              }
            />
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-full border-success/40 px-8 text-base text-success hover:bg-success/10 hover:text-success sm:w-auto"
              render={
                <a href={whatsappLink("Hi Jo Tech! I'd like to shop for a gadget.")} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-1 size-4" />
                  Chat on WhatsApp
                </a>
              }
            />
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={5}
            variants={fadeUp}
            className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground lg:justify-start"
          >
            <div className="flex items-center gap-0.5 text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <span className="font-medium text-foreground">{googleRating ?? "4.8"}</span>
            <span>on Google · thousands of happy customers</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <HeroDevices />
        </motion.div>
      </div>
    </section>
  );
}

function Dot() {
  return <span className="size-1 rounded-full bg-accent" aria-hidden />;
}
