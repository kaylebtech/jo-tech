import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/shared/reveal";

export type FAQItem = { id: string; question: string; answer: string };

export function FAQSection({ faqs }: { faqs: FAQItem[] }) {
  if (faqs.length === 0) return null;

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Reveal className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">FAQ</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Frequently Asked Questions
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <Accordion className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left text-base font-medium">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>

      <Reveal delay={0.15} className="mt-8 text-center text-sm text-muted-foreground">
        Still have questions?{" "}
        <Link href="/faq" className="font-medium text-primary hover:underline">
          See the full FAQ
        </Link>
      </Reveal>
    </section>
  );
}
