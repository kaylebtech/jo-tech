"use client";

import { useLocalStorageList } from "@/hooks/use-local-storage-list";

export function useWishlist() {
  const list = useLocalStorageList("jth:wishlist", 100);
  return {
    wishlist: list.ids,
    isWishlisted: list.has,
    toggleWishlist: list.toggle,
    hydrated: list.hydrated,
  };
}
