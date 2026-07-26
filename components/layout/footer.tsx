import Link from "next/link";
import { Smartphone, MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import { BUILDER, BUSINESS, SITE_NAME, whatsappLink } from "@/lib/constants";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { InstagramIcon, FacebookIcon } from "@/components/shared/social-icons";

const SHOP_LINKS = [
  { label: "Smartphones", href: "/category/smartphones" },
  { label: "Laptops", href: "/category/laptops" },
  { label: "Wearables", href: "/category/wearables" },
  { label: "Audio", href: "/category/audio" },
  { label: "Accessories", href: "/category/accessories" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Buy · Sell · Swap", href: "/buy-sell-swap" },
  { label: "Repairs", href: "/repairs" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Visit Our Store", href: "/visit-us" },
];

export function Footer({
  socialLinks,
  whatsappNumber,
}: {
  socialLinks?: { instagram?: string; facebook?: string; tiktok?: string; x?: string } | null;
  whatsappNumber: string;
}) {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Smartphone className="size-5" />
              </span>
              <span className="text-base font-semibold tracking-tight">{SITE_NAME}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Nigeria&apos;s trusted gadget marketplace — genuine smartphones, laptops, smart
              watches, AirPods, speakers and accessories. Buy, sell, swap, and repair with
              confidence.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socialLinks?.instagram && (
                <SocialIcon href={socialLinks.instagram} label="Instagram">
                  <InstagramIcon className="size-4" />
                </SocialIcon>
              )}
              {socialLinks?.facebook && (
                <SocialIcon href={socialLinks.facebook} label="Facebook">
                  <FacebookIcon className="size-4" />
                </SocialIcon>
              )}
              <SocialIcon href={whatsappLink("Hi Jo Tech! I have a question.", whatsappNumber)} label="WhatsApp">
                <MessageCircle className="size-4" />
              </SocialIcon>
            </div>
          </div>

          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />

          <div>
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>
                  {BUSINESS.addressLine}, {BUSINESS.city}, {BUSINESS.country}
                </span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
                <a href={`tel:${BUSINESS.phoneNumbers[0].replace(/\s/g, "")}`} className="hover:text-foreground">
                  {BUSINESS.phoneNumbers[0]}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
                <a href={`mailto:${BUSINESS.email}`} className="hover:text-foreground">
                  {BUSINESS.email}
                </a>
              </li>
            </ul>
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-foreground">Stay in the loop</h3>
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p>Genuine devices · Warranty backed · Lagos, Nigeria</p>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground/70">
          Built by{" "}
          <a
            href={BUILDER.url}
            target="_blank"
            rel="noopener"
            className="font-medium text-muted-foreground hover:text-foreground hover:underline"
          >
            {BUILDER.name}
          </a>{" "}
          — {BUILDER.division}
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full bg-background text-foreground/70 ring-1 ring-border transition-colors hover:bg-primary hover:text-primary-foreground hover:ring-primary"
    >
      {children}
    </a>
  );
}
