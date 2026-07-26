"use client";

import { createContext, useContext } from "react";
import { BUSINESS } from "@/lib/constants";

const WhatsappNumberContext = createContext<string | null>(null);

/** Provided once in app/(site)/layout.tsx with the admin-editable SiteSettings value. */
export function WhatsappNumberProvider({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return <WhatsappNumberContext.Provider value={number}>{children}</WhatsappNumberContext.Provider>;
}

/** Falls back to the constant if used outside the provider (e.g. isolated tests). */
export function useWhatsappNumber(): string {
  const value = useContext(WhatsappNumberContext);
  return value ?? BUSINESS.whatsappNumber;
}
