import type { Metadata } from "next";
import { Outfit, ZCOOL_XiaoWei } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

const xiaowei = ZCOOL_XiaoWei({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-xiaowei",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author }],
  openGraph: {
    type: "website",
    locale: siteConfig.language,
    siteName: siteConfig.title,
    images: [{ url: siteConfig.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    creator: siteConfig.twitterHandle,
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${outfit.variable} ${xiaowei.variable} font-sans antialiased`}>
        <ThemeProvider>
          {/* Fixed background image */}
          <div
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat brightness-[0.92] dark:brightness-[0.5]"
            style={{ backgroundImage: "url(/bg.png)" }}
          />
          {/* Tint overlay — lightens in light mode, darkens in dark mode */}
          <div className="fixed inset-0 z-0 bg-[rgba(255,250,252,0.58)] dark:bg-[rgba(8,8,16,0.58)]" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
