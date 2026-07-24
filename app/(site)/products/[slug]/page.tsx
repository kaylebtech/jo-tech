import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "@/components/product/product-gallery";
import { WishlistCompareButtons } from "@/components/product/wishlist-compare-buttons";
import { InquiryForm } from "@/components/product/inquiry-form";
import { ProductReviews } from "@/components/product/product-reviews";
import { RecordView } from "@/components/product/record-view";
import { ProductCard } from "@/components/product/product-card";
import { Reveal, RevealGroup } from "@/components/shared/reveal";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { serializeProduct } from "@/lib/serialize";
import { whatsappLink, SITE_URL } from "@/lib/constants";
import { productSchema, breadcrumbSchema, jsonLdScript } from "@/lib/schema";

type Params = { slug: string };

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const title = product.metaTitle || `${product.name} Price in Lagos, Nigeria | Jo Tech Gadgets Hub`;
  const description = product.metaDescription || product.description.slice(0, 155);
  const image = product.images[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: { title, description, images: image ? [image] : undefined, type: "website" },
  };
}

const CONDITION_LABEL: Record<string, string> = {
  NEW: "Brand New",
  UK_USED: "UK Used",
  REFURBISHED: "Refurbished",
};

export default async function ProductDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);
  const serializedRelated = related.map(serializeProduct);
  const price = product.price ? Number(product.price) : null;
  const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const specs = (product.specs as Record<string, string> | null) ?? null;
  const outOfStock = product.stockStatus === "OUT_OF_STOCK";

  return (
    <>
      <RecordView productId={product.id} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          productSchema({
            name: product.name,
            description: product.description,
            slug: product.slug,
            brand: product.brand,
            price,
            stockStatus: product.stockStatus,
            images: product.images,
            reviews: product.reviews,
          })
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Products", url: `${SITE_URL}/products` },
            { name: product.category.name, url: `${SITE_URL}/category/${product.category.slug}` },
            { name: product.name, url: `${SITE_URL}/products/${product.slug}` },
          ])
        )}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <ProductGallery images={product.images} productName={product.name} />
          </Reveal>

          <Reveal delay={0.1}>
            {product.brand && <p className="text-sm font-medium text-accent">{product.brand}</p>}
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{CONDITION_LABEL[product.condition]}</Badge>
              <Badge
                variant={outOfStock ? "destructive" : "outline"}
                className={outOfStock ? "" : "border-success/30 bg-success/10 text-success"}
              >
                {outOfStock ? "Out of stock" : product.stockStatus === "PREORDER" ? "Pre-order" : "In stock"}
              </Badge>
            </div>

            {price !== null && (
              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-foreground">{nairaFormatter.format(price)}</span>
                {compareAtPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {nairaFormatter.format(compareAtPrice)}
                  </span>
                )}
              </div>
            )}

            <p className="mt-5 leading-relaxed text-muted-foreground">{product.description}</p>

            {specs && Object.keys(specs).length > 0 && (
              <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-4 border-b border-border/60 py-1.5 sm:border-0 sm:py-0">
                    <dt className="text-sm text-muted-foreground">{key}</dt>
                    <dd className="text-sm font-medium text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full rounded-full bg-success text-success-foreground hover:bg-success/90"
                render={
                  <a
                    href={whatsappLink(`Hi Jo Tech! I'm interested in the ${product.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="size-4" />
                    WhatsApp Inquiry
                  </a>
                }
              />
              <WishlistCompareButtons productId={product.id} />
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-card p-5">
              <p className="mb-4 text-sm font-semibold text-foreground">Or send us an inquiry directly</p>
              <InquiryForm productId={product.id} productName={product.name} />
            </div>
          </Reveal>
        </div>

        <div className="mt-16 max-w-3xl">
          <h2 className="text-xl font-semibold text-foreground">Customer Reviews</h2>
          <div className="mt-5">
            <ProductReviews reviews={product.reviews} />
          </div>
        </div>

        {serializedRelated.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-semibold text-foreground">You Might Also Like</h2>
            <RevealGroup className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {serializedRelated.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </RevealGroup>
          </div>
        )}
      </div>
    </>
  );
}
