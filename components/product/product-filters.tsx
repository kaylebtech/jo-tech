"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FilterOptions = {
  categories: { name: string; slug: string }[];
  brands: string[];
};

const CONDITIONS = [
  { value: "NEW", label: "Brand New" },
  { value: "UK_USED", label: "UK Used" },
  { value: "REFURBISHED", label: "Refurbished" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

/** Desktop sidebar — render inside an element the caller hides below `lg`. */
export function ProductFiltersSidebar({ options }: { options: FilterOptions }) {
  return <FilterFields options={options} />;
}

/** Mobile "Filters" button + sheet — self-contained, only visible below `lg`. */
export function ProductFiltersMobile({ options }: { options: FilterOptions }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" className="rounded-full lg:hidden">
            <SlidersHorizontal className="size-4" />
            Filters
          </Button>
        }
      />
      <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto p-6">
        <SheetTitle>Filters</SheetTitle>
        <div className="mt-6">
          <FilterFields options={options} onApply={() => setMobileOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function FilterFields({ options, onApply }: { options: FilterOptions; onApply?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  const activeCategory = searchParams.get("category") ?? "";
  const activeBrand = searchParams.get("brand") ?? "";
  const activeCondition = searchParams.get("condition") ?? "";

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const applyPriceRange = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    onApply?.();
  };

  const clearAll = () => {
    setMinPrice("");
    setMaxPrice("");
    router.push(pathname, { scroll: false });
    onApply?.();
  };

  const hasActiveFilters = activeCategory || activeBrand || activeCondition || minPrice || maxPrice;

  return (
    <div className="space-y-6">
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 gap-1.5 px-2 text-xs text-muted-foreground">
          <X className="size-3.5" />
          Clear all filters
        </Button>
      )}

      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</Label>
        <div className="mt-2.5 flex flex-col gap-1">
          <FilterOption
            label="All Categories"
            active={!activeCategory}
            onClick={() => {
              updateParam("category", null);
              onApply?.();
            }}
          />
          {options.categories.map((cat) => (
            <FilterOption
              key={cat.slug}
              label={cat.name}
              active={activeCategory === cat.slug}
              onClick={() => {
                updateParam("category", cat.slug);
                onApply?.();
              }}
            />
          ))}
        </div>
      </div>

      {options.brands.length > 0 && (
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Brand</Label>
          <Select
            value={activeBrand || "all"}
            onValueChange={(value) => {
              updateParam("brand", value === "all" ? null : value);
              onApply?.();
            }}
          >
            <SelectTrigger className="mt-2.5 w-full">
              <SelectValue placeholder="All brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {options.brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Condition</Label>
        <div className="mt-2.5 flex flex-col gap-1">
          <FilterOption
            label="Any Condition"
            active={!activeCondition}
            onClick={() => {
              updateParam("condition", null);
              onApply?.();
            }}
          />
          {CONDITIONS.map((c) => (
            <FilterOption
              key={c.value}
              label={c.label}
              active={activeCondition === c.value}
              onClick={() => {
                updateParam("condition", c.value);
                onApply?.();
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Price Range (₦)
        </Label>
        <div className="mt-2.5 flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-9"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-9"
          />
        </div>
        <Button size="sm" variant="outline" className="mt-2.5 w-full rounded-full" onClick={applyPriceRange}>
          Apply
        </Button>
      </div>
    </div>
  );
}

function FilterOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
        active ? "bg-primary/10 font-medium text-primary" : "text-foreground/80 hover:bg-muted"
      }`}
    >
      {label}
    </button>
  );
}

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSort = searchParams.get("sort") ?? "newest";

  return (
    <Select
      value={activeSort}
      onValueChange={(value) => {
        if (!value) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", value);
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
