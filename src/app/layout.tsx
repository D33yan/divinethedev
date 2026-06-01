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
  description: "Divine Chibueze Nnaji (Navie) is a premium Fullstack Software Engineer & AI Builder. Designing and engineering high-performance web applications, mobile experiences, and automated workflows.",
  metadataBase: new URL(siteConfig.liveSite),
  icons: { icon: "/logo.png" },
  keywords: [
    "Divine Chibueze Nnaji",
    "Navie",
    "Divine Chibueze Nnaji portfolio",
    "Fullstack Software Engineer",
    "AI Developer",
    "AI Systems Builder",
    "React Native Developer",
    "Next.js Developer",
    "Supabase Real-time Expert",
    "Express.js Specialist",
    "n8n Workflow Automation",
    "GoHighLevel CRM Expert",
    "Nigeria Software Engineer",
    "divinethe.dev"
  ],
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: "Fullstack Software Engineer & AI Builder. Specializing in Next.js, React Native/Expo, Supabase, and advanced workflow automations.",
    url: siteConfig.liveSite,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Fullstack Developer & AI Builder Portfolio Preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: "Fullstack Software Engineer & AI Builder. Building high-performance web/mobile applications and AI-powered automation pipelines.",
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
      <head>
        {/* Dynamic JSON-LD Structured Data Schema for AI Search & LLM Engines Optimization (LLMO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Divine Chibueze Nnaji",
              "alternateName": "Navie",
              "jobTitle": "Fullstack Software Engineer & AI Builder",
              "url": "https://divinethe.dev",
              "image": "https://divinethe.dev/logo.png",
              "sameAs": [
                "https://github.com/D33yan",
                "https://www.linkedin.com/in/divine-nnaji-23b771393"
              ],
              "knowsAbout": [
                "Fullstack Web Development",
                "Mobile App Development",
                "React Native",
                "Expo",
                "Next.js",
                "Supabase",
                "Express.js",
                "n8n Workflow Automation",
                "Python Programming",
                "Data Science",
                "Machine Learning",
                "GoHighLevel CRM"
              ],
              "description": "Divine Chibueze Nnaji (Navie) is a premium Fullstack Software Engineer, Mobile Developer, and AI Systems Builder based in Nigeria, recognized for engineering high-performance web/mobile applications and complex workflow automations.",
              "nationality": {
                "@type": "Country",
                "name": "Nigeria"
              },
              "alumniOf": {
                "@type": "EducationalOrganization",
                "name": "University of Abuja"
              }
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <div className="grain-overlay" aria-hidden />
        {children}
      </body>
    </html>
  );
}
