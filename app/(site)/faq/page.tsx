import type { Metadata } from "next";
import { getFAQs } from "@/lib/queries";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/shared/reveal";
import { faqSchema, breadcrumbSchema, jsonLdScript } from "@/lib/schema";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about buying, selling, swapping and repairing phones and laptops at Jo Tech Gadgets Hub, Lagos — warranty, delivery, payments, and more.",
  alternates: { canonical: "/faq" },
};

export default async function FAQPage() {
  const faqs = await getFAQs();
  const categories = Array.from(new Set(faqs.map((f) => f.category).filter(Boolean))) as string[];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(faqs))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "FAQ", url: `${SITE_URL}/faq` },
          ])
        )}
      />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Reveal>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-muted-foreground">
            Everything you need to know about buying, selling, swapping and repairing your devices with Jo Tech
            Gadgets Hub.
          </p>
        </Reveal>

        {categories.map((category) => (
          <div key={category} className="mt-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent capitalize">
              {category.replace(/-/g, " ")}
            </h2>
            <Accordion className="w-full">
              {faqs
                .filter((f) => f.category === category)
                .map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left text-base font-medium">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </div>
        ))}
      </div>
    </>
  );
}
