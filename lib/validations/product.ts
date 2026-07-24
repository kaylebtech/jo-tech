import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  description: z.string().min(10, "Description is required"),
  brand: z.string().optional(),
  price: z.number().positive("Price must be greater than 0").optional(),
  compareAtPrice: z.number().positive().optional(),
  categoryId: z.string().min(1, "Select a category"),
  condition: z.enum(["NEW", "UK_USED", "REFURBISHED"]),
  stockStatus: z.enum(["IN_STOCK", "OUT_OF_STOCK", "PREORDER"]),
  featured: z.boolean(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  images: z
    .array(z.object({ url: z.string(), publicId: z.string() }))
    .min(1, "Add at least one product image"),
  specs: z.array(z.object({ key: z.string(), value: z.string() })),
});

export type ProductInput = z.infer<typeof productSchema>;
