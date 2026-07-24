import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";

export type BlogPostCardData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  category: string | null;
  publishedAt: Date | null;
};

const dateFormatter = new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" });

export function BlogPostCard({ post }: { post: BlogPostCardData }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
    >
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
  );
}
