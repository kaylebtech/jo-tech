"use client";

import { useQuery } from "@tanstack/react-query";
import type { ProductCardData } from "@/components/product/product-card";

export function useProductsByIds(ids: string[]) {
  return useQuery({
    queryKey: ["products-by-ids", ids],
    queryFn: async (): Promise<{ results: ProductCardData[] }> => {
      const res = await fetch(`/api/products/by-ids?ids=${ids.join(",")}`);
      if (!res.ok) throw new Error("Failed to load products");
      return res.json();
    },
    enabled: ids.length > 0,
  });
}
