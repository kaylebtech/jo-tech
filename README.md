# JO TECH GADGETS HUB

A premium, production-ready storefront + CMS for **JO TECH GADGETS HUB** — Lagos' gadget marketplace for smartphones, laptops, wearables, audio, tablets, gaming and accessories. Buy, sell, swap, and repair, all funnelled through WhatsApp — no payment gateway, this is a WhatsApp-inquiry commerce model, not a cart/checkout.

**Status: feature-complete.** Storefront, full SEO, and the entire admin CMS are built and verified end-to-end (see [Build status](#build-status)).

## Tech stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first theme in `app/globals.css`) + shadcn/ui (Base UI primitives, not Radix)
- Prisma 7 + PostgreSQL (driver adapter: `@prisma/adapter-pg`)
- Auth.js v5 (Credentials provider, JWT sessions) for the admin dashboard
- Motion (the renamed Framer Motion), TanStack React Query, React Hook Form + Zod
- Cloudinary (`cloudinary` server-side uploads + `next-cloudinary` delivery)
- Embla Carousel (via shadcn's `Carousel`)

## Getting started

1. **Install dependencies** (this project uses pnpm — `corepack enable` or `npm i -g pnpm` if you don't have it):
   ```bash
   pnpm install
   ```
2. **Set up your database.** Copy `.env.example` to `.env` and set `DATABASE_URL`:
   - Free hosted Postgres: [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com)
   - Or run Postgres locally (e.g. `brew install postgresql` on macOS) and point `DATABASE_URL` at it.
3. **Generate the Prisma client, run migrations, and seed sample data:**
   ```bash
   pnpm exec prisma generate
   pnpm exec prisma migrate dev --name init
   pnpm exec prisma db seed
   ```
   The seed script creates 7 categories, 22 sample products, reviews, FAQs, blog posts, gallery entries, site settings, and one admin login — printed to the console. **Change that password immediately** after your first real login. Seed credentials come from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env`.
4. **Generate an Auth.js secret** and set it as `AUTH_SECRET` in `.env`:
   ```bash
   openssl rand -base64 32
   ```
5. **Cloudinary** — create a free account at [cloudinary.com](https://cloudinary.com) and fill in `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` in `.env`. Required before uploading real product/gallery photos via the admin dashboard (the seed data uses placeholder images that don't need Cloudinary).
6. **Run the dev server:**
   ```bash
   pnpm dev
   ```
   Visit http://localhost:3000 for the storefront, http://localhost:3000/admin for the CMS.

## Environment variables

See `.env.example` for the full list with descriptions. Never commit `.env` — it's already gitignored.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `AUTH_SECRET` | Auth.js session encryption key |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, used in metadata/sitemap/JSON-LD |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Default WhatsApp number for CTAs (also editable in Site Settings) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Server-only — image uploads from the admin dashboard |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Used only by `prisma db seed` to create the first admin login |

## Database

Schema lives in `prisma/schema.prisma`. Key models: `Category`, `Product` (+ `ProductImage`), `Inquiry` (WhatsApp buy/sell/swap/repair leads — this store has no payment checkout, so there's deliberately no "Order" model with payment fields), `Review`, `BlogPost`, `FAQ`, `GalleryImage`, `SiteSettings` (singleton row for CMS-editable homepage/business content), and `AdminUser`.

The generated Prisma client is TypeScript source output to `lib/generated/prisma` (gitignored, regenerate with `pnpm exec prisma generate`). Import it via `@/lib/prisma` (the shared client singleton), not directly.

## Project structure

```
app/
  (site)/            Public storefront — layout.tsx has Header/Footer/WhatsApp button
    page.tsx          Homepage
    products/          Catalog + [slug] detail pages
    category/[slug]/   Category pages
    blog/              Blog listing + [slug] posts
    wishlist/, compare/  Client-side (localStorage) pages
    faq/, about/, repairs/, visit-us/, buy-sell-swap/
  admin/
    login/            Public login page (no sidebar layout)
    (dashboard)/      Auth-guarded — layout.tsx redirects to /login if unauthenticated
      products/, categories/, inquiries/, reviews/, blog/, faqs/, gallery/, settings/
  api/                Route handlers: auth, search, inquiries, newsletter, product lookups
  sitemap.ts, robots.ts
components/
  home/               Homepage sections (Hero, TrustBar, Categories, ...)
  product/            ProductCard, filters, gallery, quick-view, inquiry form
  blog/, layout/, shared/, admin/, ui/  (ui/ is shadcn-generated — see note below)
lib/
  actions/            Server Actions ("use server") — all admin mutations
  validations/        Zod schemas
  queries.ts          Shared Prisma read queries for the storefront
  schema.ts           JSON-LD builders
  prisma.ts, cloudinary.ts, constants.ts
hooks/                useWishlist, useCompare, useRecentlyViewed, useDebounce (all localStorage-backed)
prisma/               schema.prisma, seed.ts
```

### Notes for future contributors

- **shadcn here uses Base UI, not Radix.** Polymorphic components take a `render={<a href="..."/>}` prop, not `asChild`. Base UI's `Select`/`Accordion`/`NavigationMenu` also have different prop names than the Radix-based versions you'll find in most shadcn tutorials.
- **`lucide-react` v1 dropped brand/logo icons** (Instagram, Facebook, etc.) — see `components/shared/social-icons.tsx` for the small inline-SVG replacements.
- **Never pass a Prisma `Decimal` (e.g. `product.price`) directly from a Server Component into a Client Component or return it from a Server Action** — it isn't a plain object and Next will warn/break. Always serialize first via `lib/serialize.ts`'s `serializeProduct`, or `select` only the scalar fields you need.
- **Framer Motion opacity animations on above-the-fold content hurt LCP** — Chrome doesn't count an element as painted while `opacity: 0`. The Hero (`components/home/hero.tsx`) animates `transform` only for exactly this reason; keep that pattern for anything likely to be the LCP candidate.

## Admin CMS

Log in at `/admin/login` (seeded credentials print during `prisma db seed`). Every entity has full CRUD:

- **Products** — images (Cloudinary upload), pricing, condition, stock status, specs (key/value), featured flag, SEO fields
- **Categories**, **FAQs** — quick create/edit/delete dialogs
- **Inquiries** — WhatsApp buy/sell/swap/repair leads, status workflow (New → Contacted → Converted/Closed)
- **Reviews** — approve/reject before they appear publicly
- **Blog Posts** — cover image, category, content, publish toggle
- **Gallery** — categorized photo uploads (storefront, products, before/after repairs)
- **Site Settings** — hero copy, business hours, contact info, social links, Google rating/Maps URL — edits the `SiteSettings` singleton that drives the whole public site

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import it into [Vercel](https://vercel.com/new).
3. Add every variable from `.env.example` in the Vercel project's Environment Variables settings, using your production Neon/Supabase `DATABASE_URL` and real Cloudinary credentials. Set `NEXT_PUBLIC_SITE_URL` to your real domain.
4. Run migrations against production before or during first deploy: `pnpm exec prisma migrate deploy` (from your machine, pointed at the prod `DATABASE_URL`), then seed once if desired.
5. Deploy. Then immediately log into `/admin`, change the seeded admin password (there's no self-service password-change screen yet — update `AdminUser.passwordHash` directly via `prisma studio` or a one-off script with `bcrypt.hash`), and replace placeholder product/gallery images with real photos through the CMS.

## Performance & quality

Measured with Lighthouse (mobile, throttled) against a production build:

| Category | Score |
|---|---|
| Performance | 86 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Remaining performance headroom is mostly Lighthouse's simulated-network model being conservative about JS bundle size on a content- and animation-rich homepage (many independent interactive islands: carousels, tabs, lightbox, live search, wishlist/compare). Real observed LCP render delay is ~240ms.

## Known limitations / next steps

- No self-service admin password change UI yet (see deployment step 5 above).
- Wishlist, compare, and recently-viewed are client-side only (localStorage) — they don't sync across devices, which is intentional for this scope (no customer accounts).
- Seed data uses `placehold.co` placeholder images; replace with real product/store photography via the admin CMS before launch.
- Newsletter signups are logged server-side only (`app/api/newsletter/route.ts`) — wire up a real ESP (Resend, Mailchimp, etc.) before relying on it.

## Build status

- [x] Project scaffold (Next.js 16, TypeScript, Tailwind v4, shadcn/ui, brand theme tokens)
- [x] Prisma schema, database, seed data (7 categories, 22 products, reviews, FAQs, blog posts, gallery, site settings, admin user)
- [x] Auth.js admin authentication + `/admin/*` route protection
- [x] Cloudinary upload helper
- [x] Homepage (hero, trust bar, categories, featured products, why-choose-us, buy/sell/swap/repair, testimonials, gallery, visit-store map, FAQ, blog preview) with Motion animations — verified in light/dark mode, desktop/mobile
- [x] Product catalog, filters, search, product detail pages, wishlist/compare/recently-viewed
- [x] Full SEO: JSON-LD (LocalBusiness, Organization, Product, Breadcrumb, FAQ, BlogPosting), sitemap.xml, robots.txt, OpenGraph
- [x] Blog listing + post pages, plus FAQ/About/Repairs/Visit Us/Buy-Sell-Swap static pages
- [x] Admin CMS screens (products, categories, inquiries, reviews, blog, FAQs, gallery, site settings) — full CRUD with Cloudinary image upload, verified end-to-end
- [x] Polish pass: loading skeletons on catalog/blog/product-detail routes, WCAG AA color contrast fix, LCP fix (86 performance / 100 / 100 / 100 Lighthouse)
