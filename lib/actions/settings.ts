"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { settingsSchema, type SettingsInput } from "@/lib/validations/settings";
import { requireSuperAdmin } from "@/lib/auth-guards";

export async function updateSettings(input: SettingsInput) {
  await requireSuperAdmin();

  const data = settingsSchema.parse(input);

  const businessHours = {
    mon: data.hoursMon || "",
    tue: data.hoursTue || "",
    wed: data.hoursWed || "",
    thu: data.hoursThu || "",
    fri: data.hoursFri || "",
    sat: data.hoursSat || "",
    sun: data.hoursSun || "",
  };

  const socialLinks = {
    instagram: data.instagram || "",
    facebook: data.facebook || "",
    tiktok: data.tiktok || "",
    x: data.x || "",
  };

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      heroHeadline: data.heroHeadline,
      heroSubheadline: data.heroSubheadline,
      whatsappNumber: data.whatsappNumber,
      phoneNumbers: [data.phoneNumber],
      email: data.email || null,
      addressLine: data.addressLine,
      city: data.city,
      googleMapsUrl: data.googleMapsUrl || null,
      googleRating: data.googleRating ? Number(data.googleRating) : null,
      businessHours,
      socialLinks,
    },
    update: {
      heroHeadline: data.heroHeadline,
      heroSubheadline: data.heroSubheadline,
      whatsappNumber: data.whatsappNumber,
      phoneNumbers: [data.phoneNumber],
      email: data.email || null,
      addressLine: data.addressLine,
      city: data.city,
      googleMapsUrl: data.googleMapsUrl || null,
      googleRating: data.googleRating ? Number(data.googleRating) : null,
      businessHours,
      socialLinks,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}
