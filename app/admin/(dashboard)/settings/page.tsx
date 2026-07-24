import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/settings-form";
import type { SettingsInput } from "@/lib/validations/settings";

export const metadata: Metadata = { title: "Site Settings" };

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  const hours = (settings?.businessHours as Record<string, string> | null) ?? {};
  const social = (settings?.socialLinks as Record<string, string> | null) ?? {};

  const initial: SettingsInput = {
    heroHeadline: settings?.heroHeadline ?? "Nigeria's Trusted Gadget Marketplace",
    heroSubheadline: settings?.heroSubheadline ?? "Buy • Sell • Swap • Repair",
    whatsappNumber: settings?.whatsappNumber ?? "",
    phoneNumber: settings?.phoneNumbers?.[0] ?? "",
    email: settings?.email ?? "",
    addressLine: settings?.addressLine ?? "",
    city: settings?.city ?? "Lagos",
    googleMapsUrl: settings?.googleMapsUrl ?? "",
    googleRating: settings?.googleRating ? String(settings.googleRating) : "",
    instagram: social.instagram ?? "",
    facebook: social.facebook ?? "",
    tiktok: social.tiktok ?? "",
    x: social.x ?? "",
    hoursMon: hours.mon ?? "",
    hoursTue: hours.tue ?? "",
    hoursWed: hours.wed ?? "",
    hoursThu: hours.thu ?? "",
    hoursFri: hours.fri ?? "",
    hoursSat: hours.sat ?? "",
    hoursSun: hours.sun ?? "",
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Site Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage homepage hero content and business information.</p>
      <div className="mt-6 max-w-3xl">
        <SettingsForm initial={initial} />
      </div>
    </div>
  );
}
