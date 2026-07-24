import { z } from "zod";

export const inquirySchema = z.object({
  customerName: z.string().min(2, "Enter your full name"),
  customerPhone: z.string().min(7, "Enter a valid phone number"),
  customerEmail: z.string().email("Enter a valid email").optional().or(z.literal("")),
  message: z.string().optional(),
  productId: z.string().optional(),
  type: z.enum(["BUY", "SELL", "SWAP", "REPAIR"]),
  source: z.string().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
