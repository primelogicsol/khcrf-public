import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Manrope,
  Roboto,
  Playfair_Display,
  Merriweather,
} from "next/font/google";
import Script from "next/script";
import { headers } from 'next/headers';
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import ImpersonationBanner from "@/components/common/ImpersonationBanner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hcrfoundation.org"),
  title: {
    default: "Hamadan Craft Revival Foundation",
    template: "%s | KHCRF",
  },
  description:
    "Pioneering research, policy analysis, and advocacy to protect the rich heritage of Kashmiri crafts while addressing modern challenges.",
  keywords: [
    "Kashmir",
    "Crafts",
    "Artisans",
    "Policy",
    "Research",
    "Heritage",
    "KHCRF",
  ],
  authors: [{ name: "Hamadan Craft Revival Foundation" }],
  creator: "Hamadan Craft Revival Foundation",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hcrfoundation.org",
    siteName: "Hamadan Craft Revival Foundation",
    title: "Hamadan Craft Revival Foundation",
    description:
      "Pioneering research and policy for Kashmir's artisan ecosystem.",
    images: [
      {
        url: "/assets/images/home_bnner.png",
        width: 1200,
        height: 630,
        alt: "KHCRF - Hamadan Craft Revival Foundation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hamadan Craft Revival Foundation",
    description:
      "Pioneering research and policy for Kashmir's artisan ecosystem.",
    images: ["/assets/images/home_bnner.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/legislative-dashboard');
  const themeClass = isDashboard ? 'theme-dashboard' : 'theme-public';

  return (
    <html
      lang="en"
      className={`${themeClass} ${manrope.variable} ${roboto.variable} ${playfair.variable} ${merriweather.variable} font-sans`}
    >
      <body
        data-surface="light"
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-manrope`}
        suppressHydrationWarning={true}
      >
          <ToastProvider>
            <AuthProvider>
              <ImpersonationBanner />
              {children}
            </AuthProvider>
          </ToastProvider>
          <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      </body>
    </html>
  );
}

// Harmless frontend change for Test C

// Rollback test: causing frontend change
