import type { Metadata } from "next";
import { getProducts, getCategories, getDistinctBrands } from "@/lib/queries";
import { serializeProduct } from "@/lib/serialize";
import { ProductFiltersSidebar, ProductFiltersMobile, SortSelect } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductPagination } from "@/components/product/product-pagination";
import { breadcrumbSchema, jsonLdScript } from "@/lib/schema";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Shop Smartphones, Laptops, Wearables & Accessories in Lagos",
  description:
    "Browse Jo Tech Gadgets Hub's full catalog of brand new and UK-used smartphones, laptops, smart watches, AirPods, speakers and accessories — genuine devices, transparent pricing, warranty included.",
  alternates: { canonical: "/products" },
};

type SearchParams = {
  category?: string;
  brand?: string;
  condition?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "featured";
  q?: string;
  page?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [{ products, total, page, totalPages }, categories, brands] = await Promise.all([
    getProducts({
      category: params.category,
      brand: params.brand,
      condition: params.condition,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      sort: params.sort,
      q: params.q,
      page: params.page ? Number(params.page) : 1,
    }),
    getCategories(),
    getDistinctBrands(),
  ]);

  const serialized = products.map(serializeProduct);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Products", url: `${SITE_URL}/products` },
          ])
        )}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {params.q ? `Results for "${params.q}"` : "Shop All Products"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {total} {total === 1 ? "product" : "products"} available
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <ProductFiltersSidebar
              options={{ categories: categories.map((c) => ({ name: c.name, slug: c.slug })), brands }}
            />
          </aside>

          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <ProductFiltersMobile
                options={{ categories: categories.map((c) => ({ name: c.name, slug: c.slug })), brands }}
              />
              <div className="ml-auto">
                <SortSelect />
              </div>
            </div>

            {serialized.length > 0 ? (
              <ProductGrid products={serialized} />
            ) : (
              <div className="rounded-2xl border border-dashed border-border py-24 text-center">
                <p className="text-muted-foreground">No products match these filters.</p>
              </div>
            )}

            <ProductPagination
              basePath="/products"
              searchParams={params as Record<string, string | undefined>}
              page={page}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </>
  );
}
