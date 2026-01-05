import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/contexts/CartContext";
import {
  COMPANY_DESCRIPTION,
  COMPANY_LONGNAME,
  COMPANY_NAME,
  SITE_URL,
} from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${COMPANY_NAME} - ${COMPANY_LONGNAME}`,
    template: `%s - ${COMPANY_NAME}`,
  },
  description: COMPANY_DESCRIPTION,
  icons: {
    icon: "/icons/favicon.ico",
    shortcut: "/icons/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-AU": "/",
    },
  },

  openGraph: {
    title: `${COMPANY_NAME} - ${COMPANY_LONGNAME}`,
    description: COMPANY_DESCRIPTION,
    url: SITE_URL,
    siteName: `${COMPANY_NAME} - ${COMPANY_LONGNAME}`,
    locale: "en-AU",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: COMPANY_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY_NAME} - ${COMPANY_LONGNAME}`,
    description: COMPANY_DESCRIPTION,
    images: "/images/og-image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <Suspense fallback={<div className="h-16 bg-sky-600" />}>
            <Navbar />
          </Suspense>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
