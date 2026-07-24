"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { settingsSchema, type SettingsInput } from "@/lib/validations/settings";
import { updateSettings } from "@/lib/actions/settings";

const DAY_FIELDS = [
  { key: "hoursMon", label: "Monday" },
  { key: "hoursTue", label: "Tuesday" },
  { key: "hoursWed", label: "Wednesday" },
  { key: "hoursThu", label: "Thursday" },
  { key: "hoursFri", label: "Friday" },
  { key: "hoursSat", label: "Saturday" },
  { key: "hoursSun", label: "Sunday" },
] as const;

export function SettingsForm({ initial }: { initial: SettingsInput }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsInput>({ resolver: zodResolver(settingsSchema), defaultValues: initial });

  const onSubmit = async (data: SettingsInput) => {
    try {
      await updateSettings(data);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-semibold text-foreground">Homepage Hero</h2>
        <FieldGroup>
          <Field data-invalid={!!errors.heroHeadline}>
            <FieldLabel htmlFor="heroHeadline">Headline</FieldLabel>
            <Input id="heroHeadline" {...register("heroHeadline")} />
            <FieldError errors={[errors.heroHeadline]} />
          </Field>
          <Field data-invalid={!!errors.heroSubheadline}>
            <FieldLabel htmlFor="heroSubheadline">Subheadline</FieldLabel>
            <Input id="heroSubheadline" {...register("heroSubheadline")} />
            <FieldError errors={[errors.heroSubheadline]} />
          </Field>
        </FieldGroup>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-semibold text-foreground">Contact & Location</h2>
        <FieldGroup>
          <Field data-invalid={!!errors.whatsappNumber}>
            <FieldLabel htmlFor="whatsappNumber">WhatsApp Number (E.164, no +)</FieldLabel>
            <Input id="whatsappNumber" placeholder="2348000000000" {...register("whatsappNumber")} />
            <FieldError errors={[errors.whatsappNumber]} />
          </Field>
          <Field data-invalid={!!errors.phoneNumber}>
            <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
            <Input id="phoneNumber" {...register("phoneNumber")} />
            <FieldError errors={[errors.phoneNumber]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" {...register("email")} />
          </Field>
          <Field data-invalid={!!errors.addressLine}>
            <FieldLabel htmlFor="addressLine">Address</FieldLabel>
            <Textarea id="addressLine" rows={2} {...register("addressLine")} />
            <FieldError errors={[errors.addressLine]} />
          </Field>
          <Field data-invalid={!!errors.city}>
            <FieldLabel htmlFor="city">City</FieldLabel>
            <Input id="city" {...register("city")} />
            <FieldError errors={[errors.city]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="googleMapsUrl">Google Maps URL</FieldLabel>
            <Input id="googleMapsUrl" {...register("googleMapsUrl")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="googleRating">Google Rating (e.g. 4.8)</FieldLabel>
            <Input id="googleRating" {...register("googleRating")} />
          </Field>
        </FieldGroup>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-semibold text-foreground">Business Hours</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {DAY_FIELDS.map((day) => (
            <Field key={day.key}>
              <FieldLabel htmlFor={day.key}>{day.label}</FieldLabel>
              <Input id={day.key} placeholder="9:00 AM - 7:00 PM" {...register(day.key)} />
            </Field>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-semibold text-foreground">Social Links</h2>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="instagram">Instagram URL</FieldLabel>
            <Input id="instagram" {...register("instagram")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="facebook">Facebook URL</FieldLabel>
            <Input id="facebook" {...register("facebook")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="tiktok">TikTok URL</FieldLabel>
            <Input id="tiktok" {...register("tiktok")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="x">X (Twitter) URL</FieldLabel>
            <Input id="x" {...register("x")} />
          </Field>
        </FieldGroup>
      </div>

      <Button type="submit" size="lg" className="w-full rounded-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Save Settings
      </Button>
    </form>
  );
}
