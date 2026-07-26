import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import { BUSINESS } from "@/lib/constants";

export type ProductFilters = {
  category?: string;
  brand?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "featured";
  q?: string;
  page?: number;
};

const PAGE_SIZE = 12;

export async function getProducts(filters: ProductFilters) {
  const where: Prisma.ProductWhereInput = {};

  if (filters.category) where.category = { slug: filters.category };
  if (filters.brand) where.brand = filters.brand;
  if (filters.condition) where.condition = filters.condition as Prisma.EnumProductConditionFilter["equals"];
  if (filters.minPrice || filters.maxPrice) {
    where.price = {
      ...(filters.minPrice ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice ? { lte: filters.maxPrice } : {}),
    };
  }
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { brand: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "price-asc"
      ? { price: "asc" }
      : filters.sort === "price-desc"
        ? { price: "desc" }
        : filters.sort === "featured"
          ? { featured: "desc" }
          : { createdAt: "desc" };

  const page = filters.page && filters.page > 0 ? filters.page : 1;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, pageSize: PAGE_SIZE, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getDistinctBrands() {
  const brands = await prisma.product.findMany({
    where: { brand: { not: null } },
    select: { brand: true },
    distinct: ["brand"],
    orderBy: { brand: "asc" },
  });
  return brands.map((b) => b.brand).filter((b): b is string => !!b);
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
      reviews: { where: { approved: true }, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
  return prisma.product.findMany({
    where: { categoryId, id: { not: excludeId } },
    take: limit,
    orderBy: { featured: "desc" },
    include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getProductsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
  });
  // Preserve the caller's id order (e.g. most-recently-viewed first).
  return ids.map((id) => products.find((p) => p.id === id)).filter((p): p is (typeof products)[number] => !!p);
}

export const getSiteSettings = cache(async () => {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return settings;
});

/** Resolves the WhatsApp number every CTA site-wide should use — admin-editable, falls back to the constant only if the settings row is somehow missing. */
export async function getWhatsAppNumber() {
  const settings = await getSiteSettings();
  return settings?.whatsappNumber || BUSINESS.whatsappNumber;
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
  });
}

export async function getApprovedReviews(limit = 9) {
  return prisma.review.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getFAQs() {
  return prisma.fAQ.findMany({ orderBy: { position: "asc" } });
}

export async function getPublishedBlogPosts(limit = 3) {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

const BLOG_PAGE_SIZE = 9;

export async function getBlogPosts({ category, page = 1 }: { category?: string; page?: number }) {
  const where: Prisma.BlogPostWhereInput = { published: true };
  if (category) where.category = category;

  const currentPage = page > 0 ? page : 1;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (currentPage - 1) * BLOG_PAGE_SIZE,
      take: BLOG_PAGE_SIZE,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    posts,
    total,
    page: currentPage,
    totalPages: Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE)),
  };
}

export async function getBlogCategories() {
  const categories = await prisma.blogPost.findMany({
    where: { published: true, category: { not: null } },
    select: { category: true },
    distinct: ["category"],
  });
  return categories.map((c) => c.category).filter((c): c is string => !!c);
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}

export async function getRelatedBlogPosts(category: string | null, excludeId: string, limit = 3) {
  return prisma.blogPost.findMany({
    where: { published: true, id: { not: excludeId }, ...(category ? { category } : {}) },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getGalleryImages(limit = 8) {
  return prisma.galleryImage.findMany({ orderBy: { position: "asc" }, take: limit });
}
