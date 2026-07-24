"use client";

import { useEffect } from "react";
import { useLocalStorageList } from "@/hooks/use-local-storage-list";

const MAX_RECENT = 12;

export function useRecentlyViewed() {
  const list = useLocalStorageList("jth:recently-viewed", MAX_RECENT);
  return { recentIds: list.ids, hydrated: list.hydrated };
}

/** Call from a product detail page to record the view. */
export function useRecordProductView(productId: string) {
  const list = useLocalStorageList("jth:recently-viewed", MAX_RECENT);
  useEffect(() => {
    if (!list.hydrated) return;
    list.add(productId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, list.hydrated]);
}
