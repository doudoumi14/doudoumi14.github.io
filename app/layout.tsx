import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SITE_URL } from "@/data/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// The same static build is served from two hosts: adembrouri.com (Cloudflare)
// and doudoumi14.github.io (GitHub Pages). Without a canonical link Google sees
// two identical pages, picks one itself, and reports the other as a duplicate
// with no user-selected canonical. The tag below ships in both copies and names
// adembrouri.com as the one to index.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: "Adem Brouri, P.Eng.",
  description:
    "Engineering leadership, technology consulting, and MBA candidate — plus the side projects that keep the technical skills sharp.",
};

// Runs before first paint so a dark-mode visitor never sees a white flash,
// and so scroll-reveal only hides content when JavaScript is actually running
// (without this class, .reveal elements render normally instead of invisibly).
const bootScript = `
(function () {
  document.documentElement.classList.add('js-reveal');
  try {
    var stored = localStorage.getItem('theme');
    var dark = stored ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // themeScript below intentionally adds `dark` to <html> before hydration,
    // so the server and client classNames legitimately differ on first paint.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
