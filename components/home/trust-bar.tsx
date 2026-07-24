import { Star, ShieldCheck, BadgeCheck, Lock, Users, Clock } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";

const ITEMS = [
  { icon: Star, label: "4.8 Google Rating", sub: "500+ reviews" },
  { icon: Clock, label: "Years of Trust", sub: "Serving Lagos since day one" },
  { icon: BadgeCheck, label: "Verified Store", sub: "100% authentic devices" },
  { icon: ShieldCheck, label: "Warranty Backed", sub: "On every device we sell" },
  { icon: Lock, label: "Secure Payments", sub: "Safe, transparent transactions" },
  { icon: Users, label: "Happy Customers", sub: "Thousands served" },
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
            {ITEMS.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2 text-center lg:items-start lg:text-left">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
