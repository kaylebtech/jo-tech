"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { newsletterSchema, type NewsletterInput } from "@/lib/validations/newsletter";

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = async (data: NewsletterInput) => {
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      reset();
      toast.success("You're subscribed! Watch out for deals.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return <p className="mt-3 text-sm text-success">Thanks — you&apos;re on the list.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-3" noValidate>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="you@email.com"
          aria-label="Email address"
          className="h-10 rounded-full bg-background"
          {...register("email")}
        />
        <Button
          type="submit"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-full"
          disabled={isSubmitting}
          aria-label="Subscribe"
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </Button>
      </div>
      {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>}
    </form>
  );
}
