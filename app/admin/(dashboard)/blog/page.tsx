import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BlogTable } from "@/components/admin/blog-table";

export const metadata: Metadata = { title: "Blog Posts" };

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Blog Posts</h1>
      <p className="mt-1 text-sm text-muted-foreground">{posts.length} posts.</p>
      <div className="mt-6">
        <BlogTable posts={posts} />
      </div>
    </div>
  );
}
