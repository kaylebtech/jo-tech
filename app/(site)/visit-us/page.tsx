import type { Metadata } from "next";
import { VisitStore } from "@/components/home/visit-store";
import { getSiteSettings } from "@/lib/queries";
import { breadcrumbSchema, jsonLdScript } from "@/lib/schema";
import { SITE_URL, BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Visit Our Store — Mosafejo, Lagos",
  description: `Visit Jo Tech Gadgets Hub at ${BUSINESS.addressLine}, ${BUSINESS.city}. See our opening hours, get directions, or chat with us on WhatsApp.`,
  alternates: { canonical: "/visit-us" },
};

export default async function VisitUsPage() {
  const settings = await getSiteSettings();
  const businessHours = (settings?.businessHours as Record<string, string> | null) ?? null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Visit Our Store", url: `${SITE_URL}/visit-us` },
          ])
        )}
      />
      <VisitStore
        businessHours={businessHours}
        googleMapsUrl={settings?.googleMapsUrl}
        whatsappNumber={settings?.whatsappNumber || BUSINESS.whatsappNumber}
      />
    </>
  );
}
