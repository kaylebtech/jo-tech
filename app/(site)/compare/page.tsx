"use client";

import Image from "next/image";
import Link from "next/link";
import { Scale, Loader2, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/hooks/use-compare";
import { useProductsByIds } from "@/hooks/use-products-by-ids";
import { whatsappLink } from "@/lib/constants";
import { EmptyState } from "@/components/shared/empty-state";

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function ComparePage() {
  const { compareIds, hydrated, removeFromCompare, clearCompare } = useCompare();
  const { data, isLoading } = useProductsByIds(compareIds);
  const products = data?.results ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Compare Products</h1>
          <p className="mt-2 text-muted-foreground">Compare specs and prices side by side.</p>
        </div>
        {products.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearCompare}>
            Clear all
          </Button>
        )}
      </div>

      {!hydrated || (isLoading && compareIds.length > 0) ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : compareIds.length === 0 ? (
        <EmptyState
          icon={<Scale className="size-8 text-muted-foreground" />}
          title="No products to compare"
          description="Tap the scale icon on up to 4 products to compare them here."
        />
      ) : (
        <div className="mt-10 overflow-x-auto">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${products.length}, minmax(220px, 1fr))` }}
          >
            {products.map((product) => (
              <div key={product.id} className="rounded-2xl border border-border bg-card p-4">
                <button
                  onClick={() => removeFromCompare(product.id)}
                  aria-label={`Remove ${product.name}`}
                  className="float-right flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
                <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                  {product.images[0] && (
                    <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                  )}
                </div>
                <Link href={`/products/${product.slug}`} className="mt-3 block font-semibold text-foreground hover:underline">
                  {product.name}
                </Link>
                {product.price !== null && (
                  <p className="mt-1 text-lg font-semibold text-foreground">{nairaFormatter.format(product.price)}</p>
                )}
                <Button
                  size="sm"
                  className="mt-3 w-full rounded-full bg-success text-success-foreground hover:bg-success/90"
                  render={
                    <a href={whatsappLink(`Hi Jo Tech! I'm comparing and interested in the ${product.name}.`)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="size-3.5" />
                      Inquire
                    </a>
                  }
                />
              </div>
            ))}
          </div>

          <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
            <CompareRow label="Brand" values={products.map((p) => p.brand ?? "—")} />
            <CompareRow label="Condition" values={products.map((p) => p.condition.replace("_", " "))} />
            <CompareRow label="Stock" values={products.map((p) => p.stockStatus.replace("_", " "))} />
          </div>
        </div>
      )}
    </div>
  );
}

function CompareRow({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${values.length}, minmax(220px, 1fr))` }}>
      {values.map((value, i) => (
        <div key={i}>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 text-sm text-foreground">{value}</p>
        </div>
      ))}
    </div>
  );
}
