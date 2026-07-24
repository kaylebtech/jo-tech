import type { Metadata } from "next";
import { BuySellSwap } from "@/components/home/buy-sell-swap";
import { CtaBand } from "@/components/home/cta-band";
import { Reveal } from "@/components/shared/reveal";
import { breadcrumbSchema, jsonLdScript } from "@/lib/schema";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Buy, Sell & Swap Phones and Laptops in Lagos",
  description:
    "Buy genuine devices, sell your old phone or laptop for cash, or swap up to something newer at Jo Tech Gadgets Hub, Lagos — fast, fair, and transparent.",
  alternates: { canonical: "/buy-sell-swap" },
};

export default function BuySellSwapPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Buy, Sell, Swap", url: `${SITE_URL}/buy-sell-swap` },
          ])
        )}
      />
      <div className="pt-10 lg:pt-14">
        <Reveal className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Buy, Sell & Swap — All in One Store
          </h1>
          <p className="mt-4 text-muted-foreground">
            Whether you're upgrading, cashing out an old device, or trading in for something new, Jo Tech Gadgets
            Hub makes it simple, fast, and fair.
          </p>
        </Reveal>
      </div>
      <BuySellSwap />
      <CtaBand />
    </>
  );
}
