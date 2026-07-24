"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { CategoryFormDialog, type EditableCategory } from "@/components/admin/category-form";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deleteCategory } from "@/lib/actions/categories";
import { getIcon } from "@/lib/icon-map";

type CategoryRow = EditableCategory & { _count: { products: number } };

export function CategoriesTable({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<EditableCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null);

  const refresh = () => router.refresh();

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          className="rounded-full"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" />
          New Category
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => {
              const Icon = getIcon(category.icon);
              return (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <span className="flex items-center gap-2.5">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </span>
                      {category.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell>{category._count.products}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Edit"
                      onClick={() => {
                        setEditing(category);
                        setFormOpen(true);
                      }}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete"
                      onClick={() => setDeleteTarget(category)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <CategoryFormDialog open={formOpen} onOpenChange={setFormOpen} category={editing} onSaved={refresh} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This category will be permanently removed. Categories with products cannot be deleted."
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteCategory(deleteTarget.id);
          toast.success("Category deleted");
          refresh();
        }}
      />
    </>
  );
}
