import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { BackToTop } from "@/components/shared/back-to-top";
import { getCategories, getSiteSettings } from "@/lib/queries";
import { organizationSchema, localBusinessSchema, jsonLdScript } from "@/lib/schema";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [categories, settings] = await Promise.all([getCategories(), getSiteSettings()]);

  const navCategories = categories.map((c) => ({ name: c.name, slug: c.slug, description: c.description }));
  const socialLinks = (settings?.socialLinks as Record<string, string> | null) ?? null;
  const businessHours = (settings?.businessHours as Record<string, string> | null) ?? null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(organizationSchema())} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          localBusinessSchema({
            businessHours,
            googleRating: settings?.googleRating ? Number(settings.googleRating) : null,
            socialLinks,
          })
        )}
      />

      <Header categories={navCategories} />
      <div className="flex-1">{children}</div>
      <Footer socialLinks={socialLinks} />
      <WhatsAppButton />
      <BackToTop />
    </>
  );
}
