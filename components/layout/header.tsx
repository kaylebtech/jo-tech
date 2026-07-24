"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Heart, Scale, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { SearchDialog } from "@/components/shared/search-dialog";
import { SITE_NAME } from "@/lib/constants";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCompare } from "@/hooks/use-compare";

export type NavCategory = {
  name: string;
  slug: string;
  description: string | null;
};

const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Buy · Sell · Swap", href: "/buy-sell-swap" },
  { label: "Repairs", href: "/repairs" },
  { label: "Blog", href: "/blog" },
  { label: "Visit Store", href: "/visit-us" },
];

export function Header({ categories }: { categories: NavCategory[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { wishlist } = useWishlist();
  const { compareIds } = useCompare();
  const wishlistCount = wishlist.length;
  const compareCount = compareIds.length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/70 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
          : "border-b border-transparent bg-background/40 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm lg:size-10">
            <Smartphone className="size-5" />
          </span>
          <span className="text-base font-semibold tracking-tight text-foreground lg:text-lg">
            {SITE_NAME}
          </span>
        </Link>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent">Shop</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[560px] grid-cols-2 gap-1 p-2">
                  {categories.map((cat) => (
                    <NavigationMenuLink
                      key={cat.slug}
                      render={
                        <Link
                          href={`/category/${cat.slug}`}
                          className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/10"
                        >
                          <span className="text-sm font-medium text-foreground">{cat.name}</span>
                          {cat.description && (
                            <span className="line-clamp-1 text-xs text-muted-foreground">
                              {cat.description}
                            </span>
                          )}
                        </Link>
                      }
                    />
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {NAV_LINKS.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  render={
                    <Link
                      href={link.href}
                      className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent/10 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  }
                />
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1">
          <SearchDialog />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Wishlist"
            className="relative hidden rounded-full sm:inline-flex"
            render={<Link href="/wishlist" />}
          >
            <Heart className="size-[1.15rem]" />
            {wishlistCount > 0 && <CountBadge count={wishlistCount} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Compare"
            className="relative hidden rounded-full md:inline-flex"
            render={<Link href="/compare" />}
          >
            <Scale className="size-[1.15rem]" />
            {compareCount > 0 && <CountBadge count={compareCount} />}
          </Button>
          <ThemeToggle />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open menu" className="rounded-full lg:hidden">
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-[85vw] max-w-sm p-0">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <MobileNav categories={categories} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <Button className="hidden rounded-full lg:inline-flex" render={<Link href="/products">Shop Now</Link>} />
        </div>
      </div>
    </header>
  );
}

function MobileNav({
  categories,
  onNavigate,
}: {
  categories: NavCategory[];
  onNavigate: () => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-lg font-semibold">{SITE_NAME}</span>
      </div>
      <nav className="flex flex-col gap-1">
        <p className="mb-1 mt-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Shop by category
        </p>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            onClick={onNavigate}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent/10"
          >
            {cat.name}
          </Link>
        ))}
        <div className="my-3 h-px bg-border" />
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent/10"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/wishlist"
          onClick={onNavigate}
          className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent/10"
        >
          Wishlist
        </Link>
        <Link
          href="/compare"
          onClick={onNavigate}
          className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent/10"
        >
          Compare
        </Link>
      </nav>
      <Button
        className="mt-6 rounded-full"
        size="lg"
        render={
          <Link href="/products" onClick={onNavigate}>
            Shop Now
          </Link>
        }
      />
    </div>
  );
}

function CountBadge({ count }: { count: number }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
      {count > 9 ? "9+" : count}
    </span>
  );
}
