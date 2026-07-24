import type { Metadata } from "next";
import { BlogForm } from "@/components/admin/blog-form";

export const metadata: Metadata = { title: "New Blog Post" };

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">New Blog Post</h1>
      <div className="mt-6">
        <BlogForm />
      </div>
    </div>
  );
}
