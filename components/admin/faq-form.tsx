"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { faqSchema, type FAQInput } from "@/lib/validations/faq";
import { createFAQ, updateFAQ } from "@/lib/actions/faqs";

export type EditableFAQ = { id: string; question: string; answer: string; category: string | null };

export function FAQFormDialog({
  open,
  onOpenChange,
  faq,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq: EditableFAQ | null;
  onSaved: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FAQInput>({ resolver: zodResolver(faqSchema) });

  useEffect(() => {
    if (open) {
      reset({ question: faq?.question ?? "", answer: faq?.answer ?? "", category: faq?.category ?? "" });
    }
  }, [open, faq, reset]);

  const onSubmit = async (data: FAQInput) => {
    try {
      if (faq) {
        await updateFAQ(faq.id, data);
        toast.success("FAQ updated");
      } else {
        await createFAQ(data);
        toast.success("FAQ created");
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{faq ? "Edit FAQ" : "New FAQ"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.question}>
              <FieldLabel htmlFor="faq-question">Question</FieldLabel>
              <Input id="faq-question" {...register("question")} />
              <FieldError errors={[errors.question]} />
            </Field>
            <Field data-invalid={!!errors.answer}>
              <FieldLabel htmlFor="faq-answer">Answer</FieldLabel>
              <Textarea id="faq-answer" rows={4} {...register("answer")} />
              <FieldError errors={[errors.answer]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="faq-category">Category</FieldLabel>
              <Input id="faq-category" placeholder="e.g. general, warranty, delivery" {...register("category")} />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button type="submit" className="rounded-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {faq ? "Save Changes" : "Create FAQ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
