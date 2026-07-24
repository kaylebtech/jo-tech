import { MapPin, Phone, MessageCircle, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { BUSINESS, whatsappLink } from "@/lib/constants";

const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

const DAY_LABELS: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

export function VisitStore({
  businessHours,
  googleMapsUrl,
}: {
  businessHours?: Record<string, string> | null;
  googleMapsUrl?: string | null;
}) {
  const mapsUrl = googleMapsUrl ?? BUSINESS.googleMapsUrl;
  const mapEmbedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    `${BUSINESS.addressLine}, ${BUSINESS.city}, ${BUSINESS.country}`
  )}&output=embed`;

  return (
    <section className="bg-card/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Visit Us</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Come See Us in Person
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <Reveal className="overflow-hidden rounded-3xl border border-border lg:col-span-3">
            <iframe
              title="Jo Tech Gadgets Hub location"
              src={mapEmbedSrc}
              loading="lazy"
              className="h-[360px] w-full lg:h-full lg:min-h-[420px]"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-5 rounded-3xl border border-border bg-background p-6 lg:col-span-2 lg:p-8">
            <div className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Our Address</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {BUSINESS.addressLine}, {BUSINESS.city}, {BUSINESS.country}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="size-5" />
              </span>
              <div className="w-full">
                <p className="text-sm font-semibold text-foreground">Business Hours</p>
                <dl className="mt-1.5 space-y-1 text-sm text-muted-foreground">
                  {businessHours
                    ? DAY_ORDER.filter((day) => businessHours[day]).map((day) => (
                        <div key={day} className="flex justify-between gap-4">
                          <dt>{DAY_LABELS[day]}</dt>
                          <dd className="text-foreground/80">{businessHours[day]}</dd>
                        </div>
                      ))
                    : "Mon – Sat: 9:00 AM – 7:00 PM"}
                </dl>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Call Us</p>
                <a href={`tel:${BUSINESS.phoneNumbers[0].replace(/\s/g, "")}`} className="mt-1 block text-sm text-muted-foreground hover:text-foreground">
                  {BUSINESS.phoneNumbers[0]}
                </a>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-2.5">
              <Button
                className="w-full rounded-full bg-success text-success-foreground hover:bg-success/90"
                render={
                  <a href={whatsappLink("Hi Jo Tech! I'd like to visit the store.")} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="size-4" />
                    Chat on WhatsApp
                  </a>
                }
              />
              <Button
                variant="outline"
                className="w-full rounded-full"
                render={
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                    <Navigation className="size-4" />
                    Get Directions
                  </a>
                }
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
