"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { ImageUploader } from "@/components/admin/image-uploader";
import { productSchema, type ProductInput } from "@/lib/validations/product";
import { createProduct, updateProduct } from "@/lib/actions/products";

export type ProductFormInitial = ProductInput & { id?: string };

export function ProductForm({
  initial,
  categories,
}: {
  initial?: ProductFormInitial;
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: initial ?? {
      name: "",
      slug: "",
      description: "",
      brand: "",
      categoryId: "",
      condition: "NEW",
      stockStatus: "IN_STOCK",
      featured: false,
      images: [],
      specs: [],
    },
  });

  const specsArray = useFieldArray({ control, name: "specs" });

  const nameValue = watch("name");
  useEffect(() => {
    if (!initial && nameValue) {
      setValue(
        "slug",
        nameValue
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameValue]);

  const onSubmit = async (data: ProductInput) => {
    try {
      if (initial?.id) {
        await updateProduct(initial.id, data);
        toast.success("Product updated");
      } else {
        await createProduct(data);
        toast.success("Product created");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 font-semibold text-foreground">Basic Information</h2>
            <FieldGroup>
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">Product Name</FieldLabel>
                <Input id="name" {...register("name")} />
                <FieldError errors={[errors.name]} />
              </Field>

              <Field data-invalid={!!errors.slug}>
                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                <Input id="slug" {...register("slug")} />
                <FieldError errors={[errors.slug]} />
              </Field>

              <Field data-invalid={!!errors.description}>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea id="description" rows={4} {...register("description")} />
                <FieldError errors={[errors.description]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="brand">Brand</FieldLabel>
                <Input id="brand" {...register("brand")} />
              </Field>
            </FieldGroup>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 font-semibold text-foreground">Images</h2>
            <Controller
              control={control}
              name="images"
              render={({ field }) => (
                <ImageUploader folder="products" images={field.value} onChange={field.onChange} />
              )}
            />
            {errors.images && <p className="mt-2 text-sm text-destructive">{errors.images.message}</p>}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Specifications</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => specsArray.append({ key: "", value: "" })}
              >
                <Plus className="size-3.5" />
                Add Spec
              </Button>
            </div>
            <div className="space-y-2.5">
              {specsArray.fields.map((field, i) => (
                <div key={field.id} className="flex gap-2">
                  <Input placeholder="e.g. Storage" {...register(`specs.${i}.key`)} />
                  <Input placeholder="e.g. 256GB" {...register(`specs.${i}.value`)} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => specsArray.remove(i)}
                    aria-label="Remove spec"
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {specsArray.fields.length === 0 && (
                <p className="text-sm text-muted-foreground">No specs added yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 font-semibold text-foreground">SEO</h2>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="metaTitle">Meta Title</FieldLabel>
                <Input id="metaTitle" {...register("metaTitle")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="metaDescription">Meta Description</FieldLabel>
                <Textarea id="metaDescription" rows={2} {...register("metaDescription")} />
              </Field>
            </FieldGroup>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 font-semibold text-foreground">Organization</h2>
            <FieldGroup>
              <Field data-invalid={!!errors.categoryId}>
                <FieldLabel>Category</FieldLabel>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.categoryId]} />
              </Field>

              <Field>
                <FieldLabel>Condition</FieldLabel>
                <Controller
                  control={control}
                  name="condition"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEW">Brand New</SelectItem>
                        <SelectItem value="UK_USED">UK Used</SelectItem>
                        <SelectItem value="REFURBISHED">Refurbished</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel>Stock Status</FieldLabel>
                <Controller
                  control={control}
                  name="stockStatus"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IN_STOCK">In Stock</SelectItem>
                        <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                        <SelectItem value="PREORDER">Pre-order</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field orientation="horizontal">
                <FieldLabel htmlFor="featured">Featured product</FieldLabel>
                <Controller
                  control={control}
                  name="featured"
                  render={({ field }) => (
                    <Switch id="featured" checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </Field>
            </FieldGroup>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 font-semibold text-foreground">Pricing (₦)</h2>
            <FieldGroup>
              <Field data-invalid={!!errors.price}>
                <FieldLabel htmlFor="price">Price</FieldLabel>
                <Input
                  id="price"
                  type="number"
                  {...register("price", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
                />
                <FieldError errors={[errors.price]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="compareAtPrice">Compare-at Price</FieldLabel>
                <Input
                  id="compareAtPrice"
                  type="number"
                  {...register("compareAtPrice", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
                />
                <p className="text-xs text-muted-foreground">Shown crossed out — for sale pricing.</p>
              </Field>
            </FieldGroup>
          </div>

          <Button type="submit" size="lg" className="w-full rounded-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {initial?.id ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </div>
    </form>
  );
}
