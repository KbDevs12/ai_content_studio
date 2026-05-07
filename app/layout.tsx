import type { Metadata } from "next";
import { Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nulisin.zone.id";
const SITE_NAME = "AI Content Studio";
const SITE_DESCRIPTION =
  "Generate konten berkualitas tinggi dengan AI. Blog, email, social media, dan lebih banyak lagi — gratis, cepat, tanpa batas kreativitas.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // ── Core ────────────────────────────────────────────────────────────────
  title: {
    default: `${SITE_NAME} — AI Content Generator`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "AI content generator",
    "generator konten AI",
    "blog generator",
    "social media content",
    "AI copywriting",
    "email generator",
    "konten otomatis",
    "Claude AI",
  ],

  // ── Authors / Robots ────────────────────────────────────────────────────
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  alternates: {
    canonical: SITE_URL,
  },

  // ── Open Graph ──────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — AI Content Generator`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — AI Content Generator`,
      },
    ],
  },

  // ── Twitter / X ─────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — AI Content Generator`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
    creator: "@ebfresh05",
  },

  // ── App / Theme ─────────────────────────────────────────────────────────
  applicationName: SITE_NAME,
  themeColor: "#0a0a0f",
  colorScheme: "dark",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${syne.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
