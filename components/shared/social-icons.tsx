export function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.2c0-.87.24-1.46 1.5-1.46H16.5V4.14A20 20 0 0 0 14.3 4c-2.2 0-3.7 1.34-3.7 3.8V10.5H8v3h2.6V21h2.9Z" />
    </svg>
  );
}

export function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.5 3c.4 2.1 1.8 3.6 4 3.9v2.7c-1.4 0-2.8-.4-4-1.2v6.4a5.6 5.6 0 1 1-5.6-5.6c.2 0 .4 0 .6.03v2.7a2.9 2.9 0 1 0 2.3 2.83V3h2.7Z" />
    </svg>
  );
}
