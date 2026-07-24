import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z
    .string()
    .min(3, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  excerpt: z.string().optional(),
  content: z.string().min(20, "Content is required"),
  category: z.string().optional(),
  author: z.string().min(1, "Author is required"),
  published: z.boolean(),
  coverImage: z.object({ url: z.string(), publicId: z.string() }).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
