"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { Reveal, RevealGroup, revealItemVariants } from "@/components/shared/reveal";
import { motion } from "motion/react";

export type BlogPreviewItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  category: string | null;
  publishedAt: Date | null;
};

const dateFormatter = new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" });

export function BlogPreview({ posts }: { posts: BlogPreviewItem[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">From the Blog</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Guides, Reviews & Tech News
          </h2>
        </Reveal>
        <Link href="/blog" className="group hidden items-center gap-1.5 text-sm font-medium text-foreground sm:inline-flex">
          Read all articles
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <motion.div key={post.id} variants={revealItemVariants}>
            <Link href={`/blog/${post.slug}`} className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                {post.coverImageUrl && (
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-5">
                {post.category && (
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                    {post.category.replace(/-/g, " ")}
                  </p>
                )}
                <h3 className="mt-2 line-clamp-2 font-semibold text-foreground">{post.title}</h3>
                {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>}
                {post.publishedAt && (
                  <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" />
                    {dateFormatter.format(post.publishedAt)}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </RevealGroup>
    </section>
  );
}
