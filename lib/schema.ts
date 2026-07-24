import { BUSINESS, SITE_NAME, SITE_URL } from "@/lib/constants";

type BusinessHours = Record<string, string>;

function dayCodeToSchema(code: string) {
  const map: Record<string, string> = {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday",
  };
  return map[code] ?? code;
}

/** Parses "9:00 AM - 7:00 PM" into { opens: "09:00", closes: "19:00" } (schema.org needs 24h). */
function parseHoursRange(range: string): { opens: string; closes: string } | null {
  const match = range.match(
    /(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i
  );
  if (!match) return null;
  const to24 = (h: string, m: string, meridiem: string) => {
    let hour = parseInt(h, 10) % 12;
    if (meridiem.toUpperCase() === "PM") hour += 12;
    return `${String(hour).padStart(2, "0")}:${m}`;
  };
  return {
    opens: to24(match[1], match[2], match[3]),
    closes: to24(match[4], match[5], match[6]),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: ["Jo Tech", "Jotech", "JoTech Gadgets Hub", "Jotech Nigeria"],
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [] as string[],
  };
}

export function localBusinessSchema(options?: {
  businessHours?: BusinessHours | null;
  googleRating?: number | null;
  socialLinks?: Record<string, string> | null;
}) {
  const openingHoursSpecification = options?.businessHours
    ? Object.entries(options.businessHours)
        .map(([day, range]) => {
          const parsed = parseHoursRange(range);
          if (!parsed) return null;
          return {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: dayCodeToSchema(day),
            opens: parsed.opens,
            closes: parsed.closes,
          };
        })
        .filter(Boolean)
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    name: SITE_NAME,
    alternateName: ["Jo Tech", "Jotech", "JoTech Gadgets Hub", "Jotech Nigeria"],
    image: `${SITE_URL}/logo.png`,
    url: SITE_URL,
    telephone: BUSINESS.phoneNumbers[0],
    priceRange: "₦₦",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.addressLine,
      addressLocality: BUSINESS.city,
      addressCountry: BUSINESS.countryCode,
    },
    ...(openingHoursSpecification ? { openingHoursSpecification } : {}),
    ...(options?.googleRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: options.googleRating,
            bestRating: 5,
            reviewCount: 50,
          },
        }
      : {}),
    ...(options?.socialLinks
      ? { sameAs: Object.values(options.socialLinks).filter(Boolean) }
      : {}),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function productSchema(product: {
  name: string;
  description: string;
  slug: string;
  brand?: string | null;
  price?: number | string | null;
  stockStatus: string;
  images: { url: string; altText?: string | null }[];
  reviews?: { rating: number }[];
}) {
  const avgRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) => img.url),
    url: `${SITE_URL}/products/${product.slug}`,
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    ...(product.price
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "NGN",
            price: String(product.price),
            availability:
              product.stockStatus === "IN_STOCK"
                ? "https://schema.org/InStock"
                : product.stockStatus === "PREORDER"
                  ? "https://schema.org/PreOrder"
                  : "https://schema.org/OutOfStock",
            url: `${SITE_URL}/products/${product.slug}`,
          },
        }
      : {}),
    ...(avgRating && product.reviews
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating.toFixed(1),
            reviewCount: product.reviews.length,
          },
        }
      : {}),
  };
}

export function blogPostingSchema(post: {
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  author: string;
  publishedAt?: Date | null;
  updatedAt: Date;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
  };
}

export function jsonLdScript(schema: object) {
  return {
    __html: JSON.stringify(schema),
  };
}
