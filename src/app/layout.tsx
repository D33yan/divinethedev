import type { Metadata } from "next";
import { Fira_Code, Outfit } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-fira",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.title}`,
  description: siteConfig.aboutBio.slice(0, 160),
  metadataBase: new URL(siteConfig.liveSite),
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: `${siteConfig.name} (Navie)`,
    description: siteConfig.sidebarBio,
    url: siteConfig.liveSite,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Fullstack Developer Portfolio Preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.sidebarBio,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${firaCode.variable}`}>
      <body className="font-sans antialiased">
        <div className="grain-overlay" aria-hidden />
        {children}
      </body>
    </html>
  );
}
