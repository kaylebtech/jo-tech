"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

type SearchResult = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  price: number | null;
  images: { url: string; altText: string | null }[];
};

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const { data, isFetching } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async (): Promise<{ results: SearchResult[] }> => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: debouncedQuery.trim().length >= 2,
  });

  const results = data?.results ?? [];

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Search"
        className="hidden rounded-full sm:inline-flex"
        onClick={() => setOpen(true)}
      >
        <Search className="size-[1.15rem]" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg gap-0 overflow-hidden p-0" showCloseButton>
          <DialogTitle className="sr-only">Search products</DialogTitle>
          <DialogDescription className="sr-only">Search the Jo Tech Gadgets Hub catalog</DialogDescription>
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for smartphones, laptops, AirPods…"
              className="h-9 border-none px-0 shadow-none focus-visible:ring-0"
            />
            {isFetching && <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />}
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {debouncedQuery.trim().length < 2 && (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                Type at least 2 characters to search
              </p>
            )}
            {debouncedQuery.trim().length >= 2 && !isFetching && results.length === 0 && (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                No products found for &ldquo;{debouncedQuery}&rdquo;
              </p>
            )}
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
              >
                <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                  {product.images[0] && (
                    <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  {product.brand && <p className="text-xs text-accent">{product.brand}</p>}
                  <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                </div>
                {product.price !== null && (
                  <p className="shrink-0 text-sm font-medium text-foreground">
                    {nairaFormatter.format(product.price)}
                  </p>
                )}
              </Link>
            ))}
            {results.length > 0 && (
              <Link
                href={`/products?q=${encodeURIComponent(debouncedQuery)}`}
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center justify-center gap-1.5 rounded-lg p-2.5 text-sm font-medium text-primary hover:bg-muted"
              >
                See all results
                <ArrowRight className="size-3.5" />
              </Link>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
