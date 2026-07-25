export const SITE_NAME = "JO TECH GADGETS HUB";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jotechgadgetshub.com";

export const BUSINESS = {
  legalName: "JO TECH GADGETS HUB",
  shortName: "Jo Tech",
  addressLine: "Shop 3, Beside LASU External Campus, Off Iworo-Ajido, Mosafejo",
  city: "Lagos",
  country: "Nigeria",
  countryCode: "NG",
  whatsappNumber: "2348000000000",
  phoneNumbers: ["+234 800 000 0000"],
  email: "info@jotechgadgetshub.com",
  googleMapsUrl: "https://maps.google.com/?q=Jo+Tech+Gadgets+Hub+Mosafejo+Lagos",
} as const;

export const BUILDER = {
  name: "Brivent Global Innovations Ltd",
  division: "Brivent Product Lab",
  url: "https://www.brivent.co/",
} as const;

export const KEYWORD_ALIASES = [
  "Jo Tech",
  "Jotech",
  "JO TECH",
  "JoTech Gadgets Hub",
  "Jotech Nigeria",
] as const;

export function whatsappLink(message: string, number: string = BUSINESS.whatsappNumber) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function placeholderImage(label: string, size = "800x800") {
  return `https://placehold.co/${size}/174EA6/FFFFFF/png?text=${encodeURIComponent(label)}&font=montserrat`;
}
