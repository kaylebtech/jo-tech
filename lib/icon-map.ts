import {
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Tablet,
  Gamepad2,
  Cable,
  Package,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Tablet,
  Gamepad2,
  Cable,
};

export function getIcon(name?: string | null): LucideIcon {
  if (!name) return Package;
  return ICON_MAP[name] ?? Package;
}
