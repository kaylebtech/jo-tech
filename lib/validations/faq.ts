import { z } from "zod";

export const faqSchema = z.object({
  question: z.string().min(5, "Question is required"),
  answer: z.string().min(5, "Answer is required"),
  category: z.string().optional(),
});

export type FAQInput = z.infer<typeof faqSchema>;
