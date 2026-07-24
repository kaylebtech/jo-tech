"use client";

import { useLocalStorageList } from "@/hooks/use-local-storage-list";

const MAX_COMPARE = 4;

export function useCompare() {
  const list = useLocalStorageList("jth:compare", MAX_COMPARE);
  return {
    compareIds: list.ids,
    isComparing: list.has,
    toggleCompare: list.toggle,
    removeFromCompare: list.remove,
    clearCompare: list.clear,
    hydrated: list.hydrated,
    isFull: list.ids.length >= MAX_COMPARE,
    maxCompare: MAX_COMPARE,
  };
}
