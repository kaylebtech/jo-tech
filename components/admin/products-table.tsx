"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deleteProduct } from "@/lib/actions/products";

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  stockStatus: string;
  featured: boolean;
  category: { name: string };
  images: { url: string }[];
};

export function ProductsTable({ products }: { products: ProductRow[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<ProductRow | null>(null);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button className="rounded-full" render={<Link href="/admin/products/new" />}>
          <Plus className="size-4" />
          New Product
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <span className="flex items-center gap-3">
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {product.images[0] && (
                        <Image src={product.images[0].url} alt="" fill className="object-cover" />
                      )}
                    </span>
                    <span className="flex items-center gap-2">
                      {product.name}
                      {product.featured && <Badge variant="secondary">Featured</Badge>}
                    </span>
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{product.category.name}</TableCell>
                <TableCell>{product.price ? nairaFormatter.format(Number(product.price)) : "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant={product.stockStatus === "OUT_OF_STOCK" ? "destructive" : "outline"}
                    className={product.stockStatus === "OUT_OF_STOCK" ? "" : "border-success/30 bg-success/10 text-success"}
                  >
                    {product.stockStatus.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Edit"
                    render={<Link href={`/admin/products/${product.id}/edit`} />}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setDeleteTarget(product)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This product and its images will be permanently removed."
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteProduct(deleteTarget.id);
          toast.success("Product deleted");
          router.refresh();
        }}
      />
    </>
  );
}
