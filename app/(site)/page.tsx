import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { Categories } from "@/components/home/categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { BuySellSwap } from "@/components/home/buy-sell-swap";
import { Testimonials } from "@/components/home/testimonials";
import { Gallery } from "@/components/home/gallery";
import { VisitStore } from "@/components/home/visit-store";
import { FAQSection } from "@/components/home/faq-section";
import { BlogPreview } from "@/components/home/blog-preview";
import { CtaBand } from "@/components/home/cta-band";
import {
  getCategories,
  getFeaturedProducts,
  getApprovedReviews,
  getFAQs,
  getPublishedBlogPosts,
  getGalleryImages,
  getSiteSettings,
} from "@/lib/queries";
import { serializeProduct } from "@/lib/serialize";
import { faqSchema, jsonLdScript } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const revalidate = 300;

export default async function Home() {
  const [categories, featuredProducts, reviews, faqs, blogPosts, gallery, settings] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getApprovedReviews(),
    getFAQs(),
    getPublishedBlogPosts(),
    getGalleryImages(),
    getSiteSettings(),
  ]);

  const products = featuredProducts.map(serializeProduct);
  const businessHours = (settings?.businessHours as Record<string, string> | null) ?? null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(faqs))} />

      <Hero googleRating={settings?.googleRating ? Number(settings.googleRating) : null} />
      <TrustBar />
      <Categories categories={categories} />
      <FeaturedProducts products={products} />
      <WhyChooseUs />
      <BuySellSwap />
      <Testimonials reviews={reviews} />
      <Gallery images={gallery} />
      <VisitStore businessHours={businessHours} googleMapsUrl={settings?.googleMapsUrl} />
      <FAQSection faqs={faqs} />
      <BlogPreview posts={blogPosts} />
      <CtaBand />
    </>
  );
}
