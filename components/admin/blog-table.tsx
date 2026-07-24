"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deleteBlogPost } from "@/lib/actions/blog";

type PostRow = { id: string; title: string; category: string | null; published: boolean; publishedAt: Date | null };

export function BlogTable({ posts }: { posts: PostRow[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<PostRow | null>(null);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button className="rounded-full" render={<Link href="/admin/blog/new" />}>
          <Plus className="size-4" />
          New Post
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell className="text-muted-foreground capitalize">
                  {post.category?.replace(/-/g, " ") ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={post.published ? "outline" : "secondary"}
                    className={post.published ? "border-success/30 bg-success/10 text-success" : ""}
                  >
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" aria-label="Edit" render={<Link href={`/admin/blog/${post.id}/edit`} />}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setDeleteTarget(post)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {posts.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No blog posts yet.</p>}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.title}"?`}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteBlogPost(deleteTarget.id);
          toast.success("Post deleted");
          router.refresh();
        }}
      />
    </>
  );
}
