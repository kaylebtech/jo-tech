"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { blogPostSchema, type BlogPostInput } from "@/lib/validations/blog";
import { deleteImage } from "@/lib/cloudinary";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

function revalidateBlogPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function createBlogPost(input: BlogPostInput) {
  await requireAdmin();
  const data = blogPostSchema.parse(input);

  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content,
      category: data.category || null,
      author: data.author,
      published: data.published,
      publishedAt: data.published ? new Date() : null,
      coverImageUrl: data.coverImage?.url ?? null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
    },
  });

  revalidateBlogPaths(post.slug);
}

export async function updateBlogPost(id: string, input: BlogPostInput) {
  await requireAdmin();
  const data = blogPostSchema.parse(input);
  const existing = await prisma.blogPost.findUniqueOrThrow({ where: { id } });

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content,
      category: data.category || null,
      author: data.author,
      published: data.published,
      publishedAt: data.published ? (existing.publishedAt ?? new Date()) : existing.publishedAt,
      coverImageUrl: data.coverImage?.url ?? null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
    },
  });

  revalidateBlogPaths(existing.slug);
  if (post.slug !== existing.slug) revalidateBlogPaths(post.slug);
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();
  const post = await prisma.blogPost.delete({ where: { id } });
  if (post.coverImageUrl) {
    const publicId = extractCloudinaryPublicId(post.coverImageUrl);
    if (publicId) await deleteImage(publicId).catch(() => {});
  }
  revalidateBlogPaths(post.slug);
}

function extractCloudinaryPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
  return match ? match[1] : null;
}
