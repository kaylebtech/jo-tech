import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, ProductCondition, StockStatus } from "../lib/generated/prisma/client";
import { BUSINESS, placeholderImage } from "../lib/constants";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/**
 * Real photos (Unsplash License — free for commercial use, no attribution
 * required) keyed by product slug, used instead of the navy placehold.co
 * blocks where a reasonable match exists. Deliberately NOT manufacturer
 * marketing photography (Apple/Samsung press images) — those are copyrighted
 * and unsafe to use on a commercial site without a license. Coverage is
 * uneven: exact-model shots exist for global flagships, but Unsplash has
 * no photos of Nigeria-market devices (Tecno, Infinix) or of most exact
 * current-year mid-range SKUs, so those fall back to a generic device photo
 * of the same category — not a literal match, disclosed here for whoever
 * reads this next.
 */
const UNSPLASH_PRODUCT_PHOTOS: Record<string, string> = {
  "iphone-15-pro-max": "https://images.unsplash.com/photo-1695639509828-d4260075e370",
  "samsung-galaxy-s24-ultra": "https://images.unsplash.com/photo-1705585174953-9b2aa8afc174",
  "samsung-galaxy-a55": "https://images.unsplash.com/photo-1504999968522-8765b15c8aee", // generic Samsung Galaxy, not A55-specific
  "infinix-zero-30-5g": "https://images.unsplash.com/photo-1690555405172-5a01affadab3", // generic phone camera close-up, not Infinix-specific
  "tecno-camon-30-premier": "https://images.unsplash.com/photo-1760597371564-e44d6e361cbb", // generic phone camera module, not Tecno-specific
  "macbook-air-m3-13": "https://images.unsplash.com/photo-1537731121640-bc1c4aba9b80",
  "macbook-pro-14-m3-pro": "https://images.unsplash.com/photo-1529071242804-840f9a164b8b",
  "dell-xps-13": "https://images.unsplash.com/photo-1593642633279-1796119d5482",
  "hp-pavilion-15": "https://images.unsplash.com/photo-1683128069421-2c1881f70ed7", // HP logo close-up, not Pavilion-specific
  "apple-watch-series-9": "https://images.unsplash.com/photo-1610991138842-6a635857608c", // Apple Watch (earlier series), not S9-specific
  "samsung-galaxy-watch-6": "https://images.unsplash.com/photo-1553532129-70c57eb2bf81", // Galaxy Watch Active, not Watch 6-specific
  "airpods-pro-2nd-gen": "https://images.unsplash.com/photo-1620620153794-8bb473687c76",
  "airpods-max": "https://images.unsplash.com/photo-1628329567705-f8f7150c3cff",
  "jbl-flip-6": "https://images.unsplash.com/photo-1589273705736-1bd0a0bcf116", // generic JBL portable speaker, not Flip 6-specific
  "ipad-air-5th-gen": "https://images.unsplash.com/photo-1759820941220-fed6a1010146",
  "samsung-galaxy-tab-s9": "https://images.unsplash.com/photo-1522204553393-1f71c9d4296d", // generic Samsung tablet, not Tab S9-specific
  "playstation-5-slim": "https://images.unsplash.com/photo-1752262526779-bd65a9b83c25",
  "xbox-series-x": "https://images.unsplash.com/photo-1621259182978-fbf93132d53d", // Xbox One pictured, not Series X-specific
  "20w-usb-c-power-adapter": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0",
  "magsafe-charger": "https://images.unsplash.com/photo-1615526675159-e248c3021d3f",
  "20000mah-power-bank": "https://images.unsplash.com/photo-1525858907241-d230b66fb9fa",
};

function productImageUrl(product: { name: string; slug: string }) {
  const unsplashId = UNSPLASH_PRODUCT_PHOTOS[product.slug];
  return unsplashId ? `${unsplashId}?w=900&h=900&fit=crop&q=80&auto=format` : placeholderImage(product.name, "900x900");
}

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  condition: ProductCondition;
  stockStatus: StockStatus;
  featured?: boolean;
  specs: Record<string, string>;
};

const CATEGORIES: {
  name: string;
  slug: string;
  description: string;
  icon: string;
  products: SeedProduct[];
}[] = [
  {
    name: "Smartphones",
    slug: "smartphones",
    description: "Brand new and UK-used flagship and mid-range smartphones, fully tested and warrantied.",
    icon: "Smartphone",
    products: [
      {
        name: "iPhone 15 Pro Max",
        slug: "iphone-15-pro-max",
        description:
          "The pinnacle of Apple engineering — titanium design, A17 Pro chip, and a 5x telephoto lens for shots that used to need a separate camera. Brand new, factory sealed, full 1-year warranty.",
        brand: "Apple",
        price: 1850000,
        compareAtPrice: 2050000,
        condition: "NEW",
        stockStatus: "IN_STOCK",
        featured: true,
        specs: { Storage: "256GB", Display: "6.7\" Super Retina XDR", Chip: "A17 Pro", Camera: "48MP Triple Camera", Battery: "Up to 29hrs video" },
      },
      {
        name: "iPhone 14",
        slug: "iphone-14",
        description: "UK-used, mint condition iPhone 14 — thoroughly tested battery health above 90%, no scratches, comes with warranty.",
        brand: "Apple",
        price: 950000,
        condition: "UK_USED",
        stockStatus: "IN_STOCK",
        specs: { Storage: "128GB", Display: "6.1\" Super Retina XDR", Chip: "A15 Bionic", "Battery Health": "91%+" },
      },
      {
        name: "Samsung Galaxy S24 Ultra",
        slug: "samsung-galaxy-s24-ultra",
        description: "Samsung's most powerful flagship with a built-in S Pen, 200MP camera, and Galaxy AI features. Brand new with official Samsung warranty.",
        brand: "Samsung",
        price: 1650000,
        condition: "NEW",
        stockStatus: "IN_STOCK",
        featured: true,
        specs: { Storage: "256GB", Display: "6.8\" Dynamic AMOLED 2X", Chip: "Snapdragon 8 Gen 3", Camera: "200MP Quad Camera" },
      },
      {
        name: "Samsung Galaxy A55",
        slug: "samsung-galaxy-a55",
        description: "Premium mid-range performance with a stunning AMOLED display, ideal for everyday power users on a budget.",
        brand: "Samsung",
        price: 480000,
        condition: "NEW",
        stockStatus: "IN_STOCK",
        specs: { Storage: "128GB", Display: "6.6\" Super AMOLED", Chip: "Exynos 1480", Camera: "50MP Triple Camera" },
      },
      {
        name: "Infinix Zero 30 5G",
        slug: "infinix-zero-30-5g",
        description: "Flagship features at an unbeatable price — 108MP camera with 4K stabilized video, curved AMOLED display, and blazing 68W fast charge.",
        brand: "Infinix",
        price: 320000,
        condition: "NEW",
        stockStatus: "IN_STOCK",
        specs: { Storage: "256GB", Display: "6.78\" Curved AMOLED", Chip: "Dimensity 8020", Camera: "108MP" },
      },
      {
        name: "Tecno Camon 30 Premier",
        slug: "tecno-camon-30-premier",
        description: "Tecno's camera flagship with a 50MP portrait lens and RGBW sensor for stunning low-light photography — a favorite across Lagos.",
        brand: "Tecno",
        price: 380000,
        condition: "NEW",
        stockStatus: "IN_STOCK",
        specs: { Storage: "256GB", Display: "6.78\" AMOLED", Chip: "Dimensity 8300 Ultra", Camera: "50MP RGBW" },
      },
    ],
  },
  {
    name: "Laptops",
    slug: "laptops",
    description: "Powerful laptops for work, school, and creativity — from ultra-portable MacBooks to workstation-grade PCs.",
    icon: "Laptop",
    products: [
      {
        name: "MacBook Air M3 13\"",
        slug: "macbook-air-m3-13",
        description: "The world's most popular laptop, now with the M3 chip. Silent, fanless, and powerful enough for professional workflows on the go.",
        brand: "Apple",
        price: 1450000,
        condition: "NEW",
        stockStatus: "IN_STOCK",
        featured: true,
        specs: { Chip: "Apple M3", RAM: "8GB", Storage: "256GB SSD", Display: "13.6\" Liquid Retina" },
      },
      {
        name: "MacBook Pro 14\" M3 Pro",
        slug: "macbook-pro-14-m3-pro",
        description: "Studio-grade performance for developers, editors, and designers — Liquid Retina XDR display and all-day battery life.",
        brand: "Apple",
        price: 2650000,
        condition: "NEW",
        stockStatus: "IN_STOCK",
        featured: true,
        specs: { Chip: "Apple M3 Pro", RAM: "18GB", Storage: "512GB SSD", Display: "14.2\" Liquid Retina XDR" },
      },
      {
        name: "Dell XPS 13",
        slug: "dell-xps-13",
        description: "A stunning InfinityEdge display in an ultra-compact aluminum chassis — UK-used, excellent condition.",
        brand: "Dell",
        price: 850000,
        condition: "UK_USED",
        stockStatus: "IN_STOCK",
        specs: { CPU: "Intel Core i7 13th Gen", RAM: "16GB", Storage: "512GB SSD", Display: "13.4\" FHD+" },
      },
      {
        name: "HP Pavilion 15",
        slug: "hp-pavilion-15",
        description: "Reliable everyday performance for students and professionals, with a full-size keyboard and long battery life.",
        brand: "HP",
        price: 620000,
        condition: "NEW",
        stockStatus: "IN_STOCK",
        specs: { CPU: "Intel Core i5 12th Gen", RAM: "8GB", Storage: "512GB SSD", Display: "15.6\" FHD" },
      },
    ],
  },
  {
    name: "Wearables",
    slug: "wearables",
    description: "Smartwatches that keep up with your life — fitness tracking, notifications, and all-day battery life.",
    icon: "Watch",
    products: [
      {
        name: "Apple Watch Series 9",
        slug: "apple-watch-series-9",
        description: "The most advanced Apple Watch yet, with a brighter display and the new double-tap gesture. Brand new, sealed.",
        brand: "Apple",
        price: 520000,
        condition: "NEW",
        stockStatus: "IN_STOCK",
        featured: true,
        specs: { Case: "45mm Aluminum", Display: "Always-On Retina", Health: "ECG, Blood Oxygen", "Water Resistance": "50m" },
      },
      {
        name: "Samsung Galaxy Watch 6",
        slug: "samsung-galaxy-watch-6",
        description: "Sleeker design with advanced sleep coaching and body composition analysis, built to pair seamlessly with Galaxy phones.",
        brand: "Samsung",
        price: 380000,
        condition: "NEW",
        stockStatus: "IN_STOCK",
        specs: { Case: "44mm", Display: "Super AMOLED", Health: "BIA Sensor", "Water Resistance": "5ATM" },
      },
    ],
  },
  {
    name: "Audio",
    slug: "audio",
    description: "AirPods, headphones, and speakers for immersive sound wherever you go.",
    icon: "Headphones",
    products: [
      {
        name: "AirPods Pro (2nd Gen)",
        slug: "airpods-pro-2nd-gen",
        description: "Adaptive Audio, richer bass, and up to 2x more Active Noise Cancellation. Brand new, factory sealed with USB-C case.",
        brand: "Apple",
        price: 280000,
        condition: "NEW",
        stockStatus: "IN_STOCK",
        featured: true,
        specs: { Chip: "H2", ANC: "Adaptive", Case: "USB-C MagSafe", Battery: "Up to 30hrs with case" },
      },
      {
        name: "AirPods Max",
        slug: "airpods-max",
        description: "High-fidelity over-ear sound with computational audio and industry-leading Active Noise Cancellation.",
        brand: "Apple",
        price: 620000,
        condition: "NEW",
        stockStatus: "IN_STOCK",
        specs: { Driver: "40mm Apple-designed", ANC: "Yes", Battery: "Up to 20hrs" },
      },
      {
        name: "JBL Flip 6",
        slug: "jbl-flip-6",
        description: "Bold JBL Pro Sound in a rugged, waterproof design — perfect for the beach, the pool, or the party.",
        brand: "JBL",
        price: 110000,
        condition: "NEW",
        stockStatus: "IN_STOCK",
        specs: { Battery: "Up to 12hrs", Waterproof: "IP67", Connectivity: "Bluetooth 5.1" },
      },
    ],
  },
  {
    name: "Tablets",
    slug: "tablets",
    description: "iPads and Android tablets for work, study, and entertainment.",
    icon: "Tablet",
    products: [
      {
        name: "iPad Air (5th Gen)",
        slug: "ipad-air-5th-gen",
        description: "M1-powered performance in Apple's thinnest tablet, with support for Apple Pencil (2nd generation).",
        brand: "Apple",
        price: 780000,
        condition: "NEW",
        stockStatus: "IN_STOCK",
        specs: { Chip: "Apple M1", Storage: "64GB", Display: "10.9\" Liquid Retina" },
      },
      {
        name: "Samsung Galaxy Tab S9",
        slug: "samsung-galaxy-tab-s9",
        description: "Flagship Android tablet with a gorgeous Dynamic AMOLED 2X display and included S Pen.",
        brand: "Samsung",
        price: 890000,
        condition: "NEW",
        stockStatus: "IN_STOCK",
        specs: { Chip: "Snapdragon 8 Gen 2", Storage: "128GB", Display: "11\" Dynamic AMOLED 2X" },
      },
    ],
  },
  {
    name: "Gaming",
    slug: "gaming",
    description: "Consoles and accessories for serious gamers.",
    icon: "Gamepad2",
    products: [
      {
        name: "PlayStation 5 Slim",
        slug: "playstation-5-slim",
        description: "Lightning-fast loading with an ultra-high-speed SSD, deeper immersion with haptic feedback and 3D Audio.",
        brand: "Sony",
        price: 950000,
        condition: "NEW",
        stockStatus: "IN_STOCK",
        featured: true,
        specs: { Storage: "1TB SSD", Resolution: "Up to 4K 120fps", "Includes": "DualSense Controller" },
      },
      {
        name: "Xbox Series X",
        slug: "xbox-series-x",
        description: "The fastest, most powerful Xbox ever, with 12 teraflops of raw graphic processing power.",
        brand: "Microsoft",
        price: 880000,
        condition: "NEW",
        stockStatus: "OUT_OF_STOCK",
        specs: { Storage: "1TB SSD", Resolution: "Up to 4K 120fps" },
      },
    ],
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Chargers, cases, cables, and everything else to complete your setup.",
    icon: "Cable",
    products: [
      {
        name: "20W USB-C Power Adapter",
        slug: "20w-usb-c-power-adapter",
        description: "Fast, efficient charging for iPhone and iPad — genuine Apple power adapter.",
        brand: "Apple",
        price: 25000,
        condition: "NEW",
        stockStatus: "IN_STOCK",
        specs: { Output: "20W USB-C", Compatibility: "iPhone, iPad" },
      },
      {
        name: "MagSafe Charger",
        slug: "magsafe-charger",
        description: "Perfectly aligned magnetic wireless charging for iPhone 12 and later.",
        brand: "Apple",
        price: 45000,
        condition: "NEW",
        stockStatus: "IN_STOCK",
        specs: { Output: "15W Wireless", Compatibility: "iPhone 12+" },
      },
      {
        name: "20,000mAh Power Bank",
        slug: "20000mah-power-bank",
        description: "High-capacity fast-charging power bank with dual USB-C PD output — keep every device topped up on the go.",
        brand: "Anker",
        price: 38000,
        condition: "NEW",
        stockStatus: "IN_STOCK",
        specs: { Capacity: "20,000mAh", Output: "22.5W PD Fast Charge" },
      },
    ],
  },
];

const FAQS: { question: string; answer: string; category: string }[] = [
  {
    question: "Is JO TECH GADGETS HUB a genuine and trusted phone store in Lagos?",
    answer:
      "Yes. JO TECH GADGETS HUB is a verified gadget store located at Shop 3, Beside LASU External Campus, Off Iworo-Ajido, Mosafejo, Lagos. We sell 100% authentic, brand new and carefully tested UK-used smartphones, laptops, and accessories, all backed by warranty.",
    category: "general",
  },
  {
    question: "Do you sell brand new and UK-used (Tokunbo) phones?",
    answer:
      "We stock both brand new, factory-sealed devices and thoroughly tested UK-used phones. Every UK-used device is graded for battery health and physical condition before it's listed, so you always know exactly what you're getting.",
    category: "general",
  },
  {
    question: "Can I sell or swap my old phone at Jo Tech?",
    answer:
      "Absolutely. Bring your old smartphone, laptop, or smartwatch to our Mosafejo shop for a free, no-obligation valuation. You can sell outright for cash or swap it toward a new device — we'll always give you a fair, transparent price.",
    category: "buy-sell-swap",
  },
  {
    question: "Do you offer phone and laptop repairs?",
    answer:
      "Yes, our in-house technicians handle screen replacements, battery swaps, charging port repairs, software issues, and more — for both phones and laptops, with most repairs completed same-day.",
    category: "repairs",
  },
  {
    question: "Is there a warranty on the phones and laptops you sell?",
    answer:
      "Every brand new device comes with a manufacturer or store warranty, and UK-used devices come with a Jo Tech warranty period covering hardware faults. Warranty terms are clearly stated on your receipt at the time of purchase.",
    category: "warranty",
  },
  {
    question: "How can I contact Jo Tech Gadgets Hub or place an order?",
    answer:
      "The fastest way is WhatsApp — tap the WhatsApp button on any product or use our floating chat button to message us directly. You can also call us or visit the shop in person at Mosafejo, Lagos.",
    category: "general",
  },
  {
    question: "Do you deliver phones and laptops within Lagos and Nigeria?",
    answer:
      "Yes, we offer fast delivery across Lagos and secure nationwide delivery to other states in Nigeria. Delivery fees and timelines are confirmed with you directly on WhatsApp before your order is dispatched.",
    category: "delivery",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfer, POS payment in-store, and secure online payment. Full payment details are shared with you once your order is confirmed via WhatsApp or in-store.",
    category: "payments",
  },
];

const BLOG_POSTS: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
}[] = [
  {
    title: "iPhone 15 Pro Max vs Samsung Galaxy S24 Ultra: Which Flagship Wins in 2026?",
    slug: "iphone-15-pro-max-vs-samsung-galaxy-s24-ultra",
    excerpt:
      "Choosing between Apple and Samsung's best? We break down camera, performance, and value to help you decide — with current Lagos market pricing.",
    content:
      "When it comes to flagship smartphones in Nigeria, no rivalry runs deeper than iPhone versus Samsung. In this guide, we compare the iPhone 15 Pro Max and Samsung Galaxy S24 Ultra across camera quality, battery life, build, and everyday performance, so you can make a confident choice at Jo Tech Gadgets Hub.",
    category: "phone-comparisons",
  },
  {
    title: "How to Spot a Fake or Cloned Phone Before You Buy in Lagos",
    slug: "how-to-spot-fake-phone-lagos",
    excerpt:
      "Protect yourself from counterfeit devices with this buyer's checklist — IMEI checks, build quality signs, and trusted places to shop.",
    content:
      "Lagos' phone market is full of great deals, but also counterfeit risk. Learn how to check a phone's IMEI, verify authenticity in Settings, and why buying from a verified store like Jo Tech Gadgets Hub protects your money.",
    category: "buying-guides",
  },
  {
    title: "UK-Used vs Brand New Phones: What's the Real Difference?",
    slug: "uk-used-vs-brand-new-phones",
    excerpt:
      "Tokunbo phones can be a smart way to get premium hardware for less — if you know what to check. Here's our honest breakdown.",
    content:
      "UK-used phones are a huge part of the Nigerian market. This guide explains battery health grading, cosmetic condition standards, and why every UK-used device at Jo Tech is tested before it reaches the shelf.",
    category: "buying-guides",
  },
  {
    title: "MacBook Air M3 Review: Is It Worth It for Nigerian Creatives and Students?",
    slug: "macbook-air-m3-review",
    excerpt:
      "We test battery life, performance under real workloads, and value-for-money for the M3 MacBook Air in a Lagos context.",
    content:
      "The MacBook Air M3 brings desktop-class performance to a fanless, ultra-portable laptop. We look at how it holds up for video editing, coding, and all-day university or office use.",
    category: "laptop-reviews",
  },
  {
    title: "5 Signs Your Phone Battery Needs Replacing (And What It Costs to Fix)",
    slug: "signs-phone-battery-needs-replacing",
    excerpt:
      "Rapid battery drain, random shutdowns, and a swollen back cover are all warning signs. Here's how to know it's time for a repair.",
    content:
      "A failing battery is one of the most common repairs we see in our Mosafejo workshop. Learn the warning signs and what a professional battery replacement involves.",
    category: "repair-tips",
  },
  {
    title: "Best Budget Smartphones Under ₦400,000 in Nigeria (2026 Edition)",
    slug: "best-budget-smartphones-under-400k-nigeria",
    excerpt:
      "Infinix, Tecno, and Samsung A-series phones now pack flagship-level cameras and displays. Here are our top picks in stock right now.",
    content:
      "You don't need to spend a fortune for a great smartphone experience. We round up the best-value phones currently in stock at Jo Tech Gadgets Hub, all under ₦400,000.",
    category: "buying-guides",
  },
];

async function main() {
  console.log("Seeding JO TECH GADGETS HUB database...");

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      heroHeadline: "Nigeria's Trusted Gadget Marketplace",
      heroSubheadline: "Buy • Sell • Swap • Repair",
      whatsappNumber: BUSINESS.whatsappNumber,
      phoneNumbers: [...BUSINESS.phoneNumbers],
      email: BUSINESS.email,
      addressLine: BUSINESS.addressLine,
      city: BUSINESS.city,
      googleMapsUrl: BUSINESS.googleMapsUrl,
      googleRating: 4.8,
      businessHours: {
        mon: "9:00 AM - 7:00 PM",
        tue: "9:00 AM - 7:00 PM",
        wed: "9:00 AM - 7:00 PM",
        thu: "9:00 AM - 7:00 PM",
        fri: "9:00 AM - 7:00 PM",
        sat: "9:00 AM - 7:00 PM",
        sun: "12:00 PM - 5:00 PM",
      },
      socialLinks: {
        instagram: "https://instagram.com/jotechgadgetshub",
        facebook: "https://facebook.com/jotechgadgetshub",
        tiktok: "https://tiktok.com/@jotechgadgetshub",
        x: "https://x.com/jotechgadgetshub",
      },
    },
  });

  for (const [i, cat] of CATEGORIES.entries()) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        position: i,
        imageUrl: placeholderImage(cat.name, "600x400"),
      },
    });

    for (const [j, p] of cat.products.entries()) {
      const product = await prisma.product.upsert({
        where: { slug: p.slug },
        update: {},
        create: {
          name: p.name,
          slug: p.slug,
          description: p.description,
          brand: p.brand,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          condition: p.condition,
          stockStatus: p.stockStatus,
          featured: p.featured ?? false,
          specs: p.specs,
          categoryId: category.id,
          metaTitle: `${p.name} Price in Lagos, Nigeria | ${p.brand} | Jo Tech Gadgets Hub`,
          metaDescription: p.description.slice(0, 155),
        },
      });

      await prisma.productImage.createMany({
        data: [0, 1].map((idx) => ({
          productId: product.id,
          url: productImageUrl(p),
          publicId: `seed/${p.slug}-${idx}`,
          altText: `${p.name} — ${p.brand} at Jo Tech Gadgets Hub Lagos`,
          position: idx,
        })),
        skipDuplicates: true,
      });

      if (j % 2 === 0) {
        await prisma.review.create({
          data: {
            productId: product.id,
            authorName: ["Chidinma O.", "Emeka A.", "Blessing U.", "Tunde B.", "Fatima K."][j % 5],
            rating: 5,
            comment: `Bought my ${p.name} from Jo Tech and the process was smooth from WhatsApp inquiry to delivery. 100% genuine, exactly as described.`,
            source: "google",
            approved: true,
          },
        });
      }
    }
  }

  for (const [i, faq] of FAQS.entries()) {
    await prisma.fAQ.upsert({
      where: { id: `seed-faq-${i}` },
      update: {},
      create: { id: `seed-faq-${i}`, ...faq, position: i },
    });
  }

  for (const post of BLOG_POSTS) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        coverImageUrl: placeholderImage(post.title, "1200x630"),
        published: true,
        publishedAt: new Date(),
        metaTitle: `${post.title} | Jo Tech Gadgets Hub Blog`,
        metaDescription: post.excerpt,
      },
    });
  }

  const galleryItems: { category: string; caption: string }[] = [
    { category: "shop-outside", caption: "Jo Tech Gadgets Hub storefront, Mosafejo, Lagos" },
    { category: "shop-inside", caption: "Inside our showroom" },
    { category: "products", caption: "Latest smartphones on display" },
    { category: "products", caption: "Laptop collection" },
    { category: "repair-before", caption: "Cracked screen before repair" },
    { category: "repair-after", caption: "Same device, screen replaced" },
  ];
  for (const [i, item] of galleryItems.entries()) {
    await prisma.galleryImage.upsert({
      where: { id: `seed-gallery-${i}` },
      update: {},
      create: {
        id: `seed-gallery-${i}`,
        url: placeholderImage(item.caption, "1000x750"),
        publicId: `seed/gallery-${i}`,
        category: item.category,
        caption: item.caption,
        position: i,
      },
    });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@jotechgadgetshub.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { role: "SUPER_ADMIN" },
    create: { email: adminEmail, passwordHash, name: "Jo Tech Admin", role: "SUPER_ADMIN" },
  });

  console.log("Seed complete.");
  console.log(`Admin login -> email: ${adminEmail} | password: ${adminPassword} (change this immediately)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
