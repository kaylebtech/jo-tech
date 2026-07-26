"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, HandCoins, Repeat, Wrench, MessageCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { whatsappLink } from "@/lib/constants";
import { useWhatsappNumber } from "@/components/providers/whatsapp-provider";

const TABS = [
  {
    key: "buy",
    label: "Buy",
    icon: ShoppingBag,
    title: "Buy with total confidence",
    description:
      "Browse brand new and quality-tested UK-used smartphones, laptops, wearables and more — every listing verified, every price transparent.",
    points: ["100% genuine devices", "Warranty on every purchase", "Fast Lagos-wide delivery"],
    color: "from-primary to-primary/70",
  },
  {
    key: "sell",
    label: "Sell",
    icon: HandCoins,
    title: "Sell your old device for cash",
    description:
      "Bring in your old phone or laptop for a free, no-obligation valuation. Get a fair price, paid instantly.",
    points: ["Free instant valuation", "Fair, transparent pricing", "Cash or bank transfer on the spot"],
    color: "from-accent to-accent/70",
  },
  {
    key: "swap",
    label: "Swap",
    icon: Repeat,
    title: "Swap up to your next device",
    description:
      "Trade in your current device toward something newer — we handle the valuation and the paperwork.",
    points: ["Trade toward any in-stock device", "Top-up the difference only", "Same-day swap, walk out upgraded"],
    color: "from-success to-success/70",
  },
  {
    key: "repair",
    label: "Repair",
    icon: Wrench,
    title: "Expert repairs, done right",
    description:
      "Screen cracked? Battery dying? Our in-house technicians fix phones and laptops fast, with genuine parts.",
    points: ["Most repairs same-day", "Genuine replacement parts", "Repair warranty included"],
    color: "from-primary to-accent",
  },
] as const;

export function BuySellSwap() {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("buy");
  const activeTab = TABS.find((t) => t.key === active)!;
  const whatsappNumber = useWhatsappNumber();

  return (
    <section className="bg-card/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">One store, four ways</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Buy · Sell · Swap · Repair
          </h2>
        </Reveal>

        <div className="mx-auto mt-10 flex max-w-xl flex-wrap items-center justify-center gap-2 rounded-full border border-border bg-background p-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`relative flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                active === tab.key ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active === tab.key && (
                <motion.span
                  layoutId="buy-sell-swap-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <tab.icon className="relative z-10 size-4" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="relative mt-10 overflow-hidden rounded-3xl border border-border bg-background">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="grid grid-cols-1 lg:grid-cols-2"
            >
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <span className={`flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${activeTab.color} text-white shadow-lg`}>
                  <activeTab.icon className="size-7" />
                </span>
                <h3 className="mt-6 text-2xl font-semibold text-foreground">{activeTab.title}</h3>
                <p className="mt-3 text-muted-foreground">{activeTab.description}</p>
                <ul className="mt-6 space-y-2.5">
                  {activeTab.points.map((point) => (
                    <li key={point} className="flex items-center gap-2.5 text-sm text-foreground/90">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                        <Check className="size-3" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8 w-fit rounded-full"
                  render={
                    <a
                      href={whatsappLink(`Hi Jo Tech! I'd like to ${activeTab.label.toLowerCase()} a device.`, whatsappNumber)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="size-4" />
                      {activeTab.label} on WhatsApp
                    </a>
                  }
                />
              </div>
              <div className="relative hidden min-h-[280px] items-center justify-center overflow-hidden bg-gradient-to-br from-muted to-card lg:flex">
                <div className={`absolute size-64 rounded-full bg-gradient-to-br ${activeTab.color} opacity-20 blur-3xl`} />
                <span className={`relative flex size-32 items-center justify-center rounded-[2rem] bg-gradient-to-br ${activeTab.color} text-white shadow-2xl`}>
                  <activeTab.icon className="size-14" />
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
