import type { Metadata } from "next";
import { Reveal } from "@/components/shared/reveal";
import { TrustBar } from "@/components/home/trust-bar";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { CtaBand } from "@/components/home/cta-band";
import { breadcrumbSchema, jsonLdScript } from "@/lib/schema";
import { SITE_URL, SITE_NAME, BUSINESS } from "@/lib/constants";
import { getWhatsAppNumber } from "@/lib/queries";

export const metadata: Metadata = {
  title: "About Us",
  description: `${SITE_NAME} is Lagos' trusted gadget marketplace for genuine smartphones, laptops, wearables and accessories — buy, sell, swap and repair with confidence.`,
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const whatsappNumber = await getWhatsAppNumber();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "About Us", url: `${SITE_URL}/about` },
          ])
        )}
      />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Our Story</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            About {SITE_NAME}
          </h1>
          <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
            <p>
              {SITE_NAME} was built on a simple idea: buying and selling gadgets in Lagos should feel safe,
              transparent, and easy. From our shop in {BUSINESS.city} — {BUSINESS.addressLine} — we've become a
              trusted name for genuine smartphones, laptops, smart watches, AirPods, speakers and accessories.
            </p>
            <p>
              Whether you're buying your first smartphone, selling an old laptop, swapping up to the latest
              flagship, or need a same-day repair, our team treats every customer like a returning one. Every
              device we sell — brand new or carefully tested UK-used — is backed by warranty and honest pricing.
            </p>
            <p>
              We're proud to serve thousands of customers across Lagos and Nigeria, one genuine transaction at a
              time.
            </p>
          </div>
        </Reveal>
      </div>

      <TrustBar />
      <WhyChooseUs />
      <CtaBand whatsappNumber={whatsappNumber} />
    </>
  );
}
