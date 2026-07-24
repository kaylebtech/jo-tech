import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { whatsappLink } from "@/lib/constants";

export function CtaBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 px-6 py-14 text-center sm:px-12 lg:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 size-72 rounded-full bg-success/20 blur-3xl" />
        </div>
        <div className="relative">
          <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
            Ready to upgrade your tech?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80">
            Browse the full catalog or message us directly on WhatsApp — our team responds fast,
            every day of the week.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="h-12 w-full rounded-full px-8 text-base sm:w-auto"
              render={
                <Link href="/products">
                  Browse Products
                  <ArrowRight className="size-4" />
                </Link>
              }
            />
            <Button
              size="lg"
              className="h-12 w-full rounded-full bg-success px-8 text-base text-success-foreground hover:bg-success/90 sm:w-auto"
              render={
                <a href={whatsappLink("Hi Jo Tech! I'd like to upgrade my device.")} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-4" />
                  Chat on WhatsApp
                </a>
              }
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
