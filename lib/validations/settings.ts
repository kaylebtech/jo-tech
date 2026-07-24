import { z } from "zod";

export const settingsSchema = z.object({
  heroHeadline: z.string().min(3, "Headline is required"),
  heroSubheadline: z.string().min(1, "Subheadline is required"),
  whatsappNumber: z.string().min(7, "WhatsApp number is required"),
  phoneNumber: z.string().min(7, "Phone number is required"),
  email: z.string().optional(),
  addressLine: z.string().min(3, "Address is required"),
  city: z.string().min(1),
  googleMapsUrl: z.string().optional(),
  googleRating: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
  x: z.string().optional(),
  hoursMon: z.string().optional(),
  hoursTue: z.string().optional(),
  hoursWed: z.string().optional(),
  hoursThu: z.string().optional(),
  hoursFri: z.string().optional(),
  hoursSat: z.string().optional(),
  hoursSun: z.string().optional(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
