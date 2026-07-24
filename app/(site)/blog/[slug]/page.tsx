import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, User } from "lucide-react";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/queries";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { Reveal, RevealGroup } from "@/components/shared/reveal";
import { blogPostingSchema, breadcrumbSchema, jsonLdScript } from "@/lib/schema";
import { SITE_URL } from "@/lib/constants";

type Params = { slug: string };

const dateFormatter = new Intl.DateTimeFormat("en-NG", { dateStyle: "long" });

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || !post.published) return {};

  const title = post.metaTitle || `${post.title} | Jo Tech Gadgets Hub Blog`;
  const description = post.metaDescription || post.excerpt || post.content.slice(0, 155);

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
      publishedTime: post.publishedAt?.toISOString(),
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || !post.published) notFound();

  const related = await getRelatedBlogPosts(post.category, post.id);
  const paragraphs = post.content.split(/\n\n+/).filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          blogPostingSchema({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            coverImageUrl: post.coverImageUrl,
            author: post.author,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
          })
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Blog", url: `${SITE_URL}/blog` },
            { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
          ])
        )}
      />

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Reveal>
          {post.category && (
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              {post.category.replace(/-/g, " ")}
            </p>
          )}
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{post.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="size-4" />
              {post.author}
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                {dateFormatter.format(post.publishedAt)}
              </span>
            )}
          </div>
        </Reveal>

        {post.coverImageUrl && (
          <Reveal delay={0.1} className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
            <Image src={post.coverImageUrl} alt={post.title} fill priority className="object-cover" />
          </Reveal>
        )}

        <Reveal delay={0.15} className="mt-10">
          {paragraphs.map((p, i) => (
            <p key={i} className="mb-5 leading-relaxed text-foreground/90">
              {p}
            </p>
          ))}
        </Reveal>

        {related.length > 0 && (
          <div className="mt-16 border-t border-border pt-10">
            <h2 className="text-xl font-semibold text-foreground">Related Articles</h2>
            <RevealGroup className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((p) => (
                <BlogPostCard key={p.id} post={p} />
              ))}
            </RevealGroup>
          </div>
        )}
      </article>
    </>
  );
}
