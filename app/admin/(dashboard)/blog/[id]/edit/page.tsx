import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogForm, type BlogFormInitial } from "@/components/admin/blog-form";

export const metadata: Metadata = { title: "Edit Blog Post" };

function extractCloudinaryPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
  return match ? match[1] : null;
}

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  const publicId = post.coverImageUrl ? extractCloudinaryPublicId(post.coverImageUrl) : null;

  const initial: BlogFormInitial = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    content: post.content,
    category: post.category ?? "",
    author: post.author,
    published: post.published,
    coverImage: post.coverImageUrl && publicId ? { url: post.coverImageUrl, publicId } : undefined,
    metaTitle: post.metaTitle ?? "",
    metaDescription: post.metaDescription ?? "",
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Edit Blog Post</h1>
      <div className="mt-6">
        <BlogForm initial={initial} />
      </div>
    </div>
  );
}
