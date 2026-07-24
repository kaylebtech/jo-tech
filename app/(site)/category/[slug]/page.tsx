import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts, getCategories, getDistinctBrands, getCategoryBySlug } from "@/lib/queries";
import { serializeProduct } from "@/lib/serialize";
import { ProductFiltersSidebar, ProductFiltersMobile, SortSelect } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductPagination } from "@/components/product/product-pagination";
import { breadcrumbSchema, jsonLdScript } from "@/lib/schema";
import { SITE_URL } from "@/lib/constants";

type Params = { slug: string };
type SearchParams = {
  brand?: string;
  condition?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "featured";
  page?: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  const title = `${category.name} in Lagos, Nigeria | Buy Genuine ${category.name}`;
  const description =
    category.description ??
    `Shop genuine ${category.name.toLowerCase()} at Jo Tech Gadgets Hub, Lagos — brand new and UK-used, warranty included.`;

  return {
    title,
    description,
    alternates: { canonical: `/category/${slug}` },
    openGraph: { title, description, images: category.imageUrl ? [category.imageUrl] : undefined },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [{ products, total, page, totalPages }, categories, brands] = await Promise.all([
    getProducts({
      category: slug,
      brand: sp.brand,
      condition: sp.condition,
      minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
      maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
      sort: sp.sort,
      page: sp.page ? Number(sp.page) : 1,
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
            { name: category.name, url: `${SITE_URL}/category/${slug}` },
          ])
        )}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{category.name}</h1>
          {category.description && <p className="mt-2 max-w-2xl text-muted-foreground">{category.description}</p>}
          <p className="mt-2 text-sm text-muted-foreground">
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
                <p className="text-muted-foreground">No products in this category yet — check back soon.</p>
              </div>
            )}

            <ProductPagination
              basePath={`/category/${slug}`}
              searchParams={sp as Record<string, string | undefined>}
              page={page}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </>
  );
}
