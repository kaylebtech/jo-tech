"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { ImageUploader, type UploadedImage } from "@/components/admin/image-uploader";
import { blogPostSchema, type BlogPostInput } from "@/lib/validations/blog";
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog";

export type BlogFormInitial = BlogPostInput & { id?: string };

const BLOG_CATEGORIES = ["buying-guides", "phone-comparisons", "laptop-reviews", "repair-tips", "tech-news"];

export function BlogForm({ initial }: { initial?: BlogFormInitial }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: initial ?? {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      author: "JO TECH Gadgets Hub",
      published: false,
    },
  });

  const titleValue = watch("title");
  useEffect(() => {
    if (!initial && titleValue) {
      setValue(
        "slug",
        titleValue
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleValue]);

  const onSubmit = async (data: BlogPostInput) => {
    try {
      if (initial?.id) {
        await updateBlogPost(initial.id, data);
        toast.success("Post updated");
      } else {
        await createBlogPost(data);
        toast.success("Post created");
      }
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <FieldGroup>
          <Field data-invalid={!!errors.title}>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input id="title" {...register("title")} />
            <FieldError errors={[errors.title]} />
          </Field>

          <Field data-invalid={!!errors.slug}>
            <FieldLabel htmlFor="slug">Slug</FieldLabel>
            <Input id="slug" {...register("slug")} />
            <FieldError errors={[errors.slug]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="excerpt">Excerpt</FieldLabel>
            <Textarea id="excerpt" rows={2} {...register("excerpt")} />
          </Field>

          <Field data-invalid={!!errors.content}>
            <FieldLabel htmlFor="content">Content</FieldLabel>
            <Textarea id="content" rows={10} {...register("content")} />
            <FieldError errors={[errors.content]} />
          </Field>
        </FieldGroup>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-semibold text-foreground">Cover Image</h2>
        <Controller
          control={control}
          name="coverImage"
          render={({ field }) => (
            <ImageUploader
              folder="blog"
              multiple={false}
              max={1}
              images={field.value ? [field.value] : []}
              onChange={(images: UploadedImage[]) => field.onChange(images[0])}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Category</FieldLabel>
              <select
                {...register("category")}
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                <option value="">None</option>
                {BLOG_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace(/-/g, " ")}
                  </option>
                ))}
              </select>
            </Field>
            <Field data-invalid={!!errors.author}>
              <FieldLabel htmlFor="author">Author</FieldLabel>
              <Input id="author" {...register("author")} />
              <FieldError errors={[errors.author]} />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="published">Published</FieldLabel>
              <Controller
                control={control}
                name="published"
                render={({ field }) => (
                  <Switch id="published" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </Field>
          </FieldGroup>
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

      <Button type="submit" size="lg" className="w-full rounded-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {initial?.id ? "Save Changes" : "Create Post"}
      </Button>
    </form>
  );
}
