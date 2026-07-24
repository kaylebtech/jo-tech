import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts, getBlogCategories } from "@/lib/queries";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { ProductPagination } from "@/components/product/product-pagination";
import { RevealGroup } from "@/components/shared/reveal";
import { breadcrumbSchema, jsonLdScript } from "@/lib/schema";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog — Buying Guides, Phone Comparisons & Repair Tips",
  description:
    "Technology news, buying guides, phone comparisons, laptop reviews and repair tips from Jo Tech Gadgets Hub — Lagos' trusted gadget experts.",
  alternates: { canonical: "/blog" },
};

type SearchParams = { category?: string; page?: string };

export default async function BlogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const [{ posts, total, page, totalPages }, categories] = await Promise.all([
    getBlogPosts({ category: sp.category, page: sp.page ? Number(sp.page) : 1 }),
    getBlogCategories(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Blog", url: `${SITE_URL}/blog` },
          ])
        )}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Guides, Reviews & Tech News
          </h1>
          <p className="mt-2 text-muted-foreground">
            {total} {total === 1 ? "article" : "articles"} to help you buy, sell, and maintain your devices smarter.
          </p>
        </div>

        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <CategoryPill label="All" href="/blog" active={!sp.category} />
            {categories.map((cat) => (
              <CategoryPill
                key={cat}
                label={cat.replace(/-/g, " ")}
                href={`/blog?category=${cat}`}
                active={sp.category === cat}
              />
            ))}
          </div>
        )}

        {posts.length > 0 ? (
          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </RevealGroup>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-24 text-center">
            <p className="text-muted-foreground">No articles in this category yet.</p>
          </div>
        )}

        <ProductPagination
          basePath="/blog"
          searchParams={sp as Record<string, string | undefined>}
          page={page}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}

function CategoryPill({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-foreground/80 hover:bg-muted"
      }`}
    >
      {label}
    </Link>
  );
}
