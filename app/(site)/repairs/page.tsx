import type { Metadata } from "next";
import { MessageCircle, Smartphone, Battery, Droplets, MonitorSmartphone, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { IconFeatureGrid } from "@/components/shared/icon-feature-grid";
import { CtaBand } from "@/components/home/cta-band";
import { breadcrumbSchema, jsonLdScript } from "@/lib/schema";
import { SITE_URL, whatsappLink } from "@/lib/constants";
import { getWhatsAppNumber } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Phone & Laptop Repair Services in Lagos",
  description:
    "Screen replacement, battery repair, water damage recovery and more — Jo Tech Gadgets Hub's in-house technicians fix phones and laptops fast, with genuine parts and a repair warranty.",
  alternates: { canonical: "/repairs" },
};

const ICON_CLASS = "size-5";

const SERVICES = [
  { icon: <MonitorSmartphone className={ICON_CLASS} />, title: "Screen Replacement", description: "Cracked or unresponsive screens replaced with genuine, high-quality parts." },
  { icon: <Battery className={ICON_CLASS} />, title: "Battery Replacement", description: "Fast-draining or swollen battery? We'll swap it out safely, same-day." },
  { icon: <Droplets className={ICON_CLASS} />, title: "Water Damage Recovery", description: "Professional cleaning and component-level repair for liquid-damaged devices." },
  { icon: <Smartphone className={ICON_CLASS} />, title: "Charging Port Repair", description: "Loose or unresponsive charging ports fixed to full working condition." },
  { icon: <Wrench className={ICON_CLASS} />, title: "Software & Diagnostics", description: "Freezing, boot loops, and performance issues diagnosed and resolved." },
];

export default async function RepairsPage() {
  const whatsappNumber = await getWhatsAppNumber();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Repairs", url: `${SITE_URL}/repairs` },
          ])
        )}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Expert Repairs</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Fast, Reliable Phone & Laptop Repairs
          </h1>
          <p className="mt-4 text-muted-foreground">
            Our in-house technicians in Mosafejo, Lagos fix phones and laptops with genuine parts — most repairs
            completed the same day, all backed by a repair warranty.
          </p>
          <Button
            size="lg"
            className="mt-6 rounded-full bg-success text-success-foreground hover:bg-success/90"
            render={
              <a href={whatsappLink("Hi Jo Tech! I need a repair for my device.", whatsappNumber)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" />
                Book a Repair on WhatsApp
              </a>
            }
          />
        </Reveal>

        <IconFeatureGrid items={SERVICES} className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" />
      </div>

      <CtaBand whatsappNumber={whatsappNumber} />
    </>
  );
}
