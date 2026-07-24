"use client";

import { useCallback, useEffect, useState } from "react";

/** Tracks a small ordered list of string ids in localStorage, synced across tabs/components via a custom event. */
export function useLocalStorageList(key: string, max = 50) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const read = useCallback((): string[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  }, [key]);

  useEffect(() => {
    setIds(read());
    setHydrated(true);
    const onUpdate = () => setIds(read());
    window.addEventListener(`${key}:update`, onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener(`${key}:update`, onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [key, read]);

  const write = useCallback(
    (next: string[]) => {
      window.localStorage.setItem(key, JSON.stringify(next));
      setIds(next);
      window.dispatchEvent(new Event(`${key}:update`));
    },
    [key]
  );

  const add = useCallback(
    (id: string) => {
      const current = read();
      if (current.includes(id)) return;
      write([id, ...current].slice(0, max));
    },
    [read, write, max]
  );

  const remove = useCallback(
    (id: string) => {
      write(read().filter((i) => i !== id));
    },
    [read, write]
  );

  const toggle = useCallback(
    (id: string) => {
      const current = read();
      if (current.includes(id)) {
        write(current.filter((i) => i !== id));
      } else {
        write([id, ...current].slice(0, max));
      }
    },
    [read, write, max]
  );

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, hydrated, add, remove, toggle, has, clear: () => write([]) };
}
