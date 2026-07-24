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
import { categorySchema, type CategoryInput } from "@/lib/validations/category";
import { createCategory, updateCategory } from "@/lib/actions/categories";
import { ICON_MAP } from "@/lib/icon-map";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type EditableCategory = { id: string; name: string; slug: string; description: string | null; icon: string | null };

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: EditableCategory | null;
  onSaved: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({ resolver: zodResolver(categorySchema) });

  useEffect(() => {
    if (open) {
      reset({
        name: category?.name ?? "",
        slug: category?.slug ?? "",
        description: category?.description ?? "",
        icon: category?.icon ?? "",
      });
    }
  }, [open, category, reset]);

  const nameValue = watch("name");

  useEffect(() => {
    if (!category && nameValue) {
      setValue("slug", slugify(nameValue));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameValue]);

  const onSubmit = async (data: CategoryInput) => {
    try {
      if (category) {
        await updateCategory(category.id, data);
        toast.success("Category updated");
      } else {
        await createCategory(data);
        toast.success("Category created");
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
          <DialogTitle>{category ? "Edit Category" : "New Category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="cat-name">Name</FieldLabel>
              <Input id="cat-name" {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={!!errors.slug}>
              <FieldLabel htmlFor="cat-slug">Slug</FieldLabel>
              <Input id="cat-slug" {...register("slug")} />
              <FieldError errors={[errors.slug]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="cat-description">Description</FieldLabel>
              <Textarea id="cat-description" rows={2} {...register("description")} />
            </Field>

            <Field>
              <FieldLabel>Icon</FieldLabel>
              <Select value={watch("icon") || undefined} onValueChange={(v) => v && setValue("icon", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(ICON_MAP).map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="submit" className="rounded-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {category ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
