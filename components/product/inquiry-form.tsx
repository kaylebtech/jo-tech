"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { inquirySchema, type InquiryInput } from "@/lib/validations/inquiry";

export function InquiryForm({ productId, productName }: { productId: string; productName: string }) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      productId,
      type: "BUY",
      source: "product_page",
      message: `Hi, I'm interested in the ${productName}. Is it still available?`,
    },
  });

  const onSubmit = async (data: InquiryInput) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      toast.success("Inquiry sent — we'll reach out shortly.");
    } catch {
      toast.error("Something went wrong. Please try WhatsApp instead.");
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-success/30 bg-success/5 px-6 py-10 text-center">
        <CheckCircle2 className="size-8 text-success" />
        <p className="font-medium text-foreground">Inquiry received</p>
        <p className="text-sm text-muted-foreground">
          Our team will contact you shortly about the {productName}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.customerName}>
          <FieldLabel htmlFor="customerName">Full name</FieldLabel>
          <Input id="customerName" placeholder="Your name" {...register("customerName")} />
          <FieldError errors={[errors.customerName]} />
        </Field>

        <Field data-invalid={!!errors.customerPhone}>
          <FieldLabel htmlFor="customerPhone">Phone number</FieldLabel>
          <Input id="customerPhone" type="tel" placeholder="080X XXX XXXX" {...register("customerPhone")} />
          <FieldError errors={[errors.customerPhone]} />
        </Field>

        <Field data-invalid={!!errors.customerEmail}>
          <FieldLabel htmlFor="customerEmail">Email (optional)</FieldLabel>
          <Input id="customerEmail" type="email" placeholder="you@email.com" {...register("customerEmail")} />
          <FieldError errors={[errors.customerEmail]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="message">Message</FieldLabel>
          <Textarea id="message" rows={3} {...register("message")} />
        </Field>

        <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          Send Inquiry
        </Button>
      </FieldGroup>
    </form>
  );
}
