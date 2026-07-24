"use client";

import { useRecordProductView } from "@/hooks/use-recently-viewed";

/** Invisible — records this product as viewed for the "Recently Viewed" feature. */
export function RecordView({ productId }: { productId: string }) {
  useRecordProductView(productId);
  return null;
}
