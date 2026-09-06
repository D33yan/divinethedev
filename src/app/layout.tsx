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
        {/* Schema.org JSON-LD Structured Data for Google Search Rich Results and Knowledge Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://divinethe.dev/#person",
                  "name": "Divine Chibueze Nnaji",
                  "alternateName": ["Navie", "Divine Nnaji"],
                  "jobTitle": "Fullstack Software Engineer & AI Builder",
                  "url": "https://divinethe.dev",
                  "image": "https://divinethe.dev/logo.png",
                  "email": "mailto:dnnaji26@gmail.com",
                  "sameAs": [
                    "https://github.com/D33yan",
                    "https://www.linkedin.com/in/divine-nnaji-23b771393",
                    "https://t.me/Callmenavi3"
                  ],
                  "knowsAbout": [
                    "Next.js",
                    "React",
                    "React Native",
                    "TypeScript",
                    "Supabase",
                    "PostgreSQL",
                    "Python",
                    "n8n Automation",
                    "Gemini AI & LangChain",
                    "Mobile App Development",
                    "Fullstack Web Engineering"
                  ],
                  "description": "Divine Chibueze Nnaji (Navie) is a Fullstack Software Engineer & AI Builder engineering high-performance web applications, mobile experiences, and automated AI systems.",
                  "nationality": {
                    "@type": "Country",
                    "name": "Nigeria"
                  },
                  "alumniOf": {
                    "@type": "EducationalOrganization",
                    "name": "University of Abuja"
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://divinethe.dev/#website",
                  "url": "https://divinethe.dev",
                  "name": "Divine Chibueze Nnaji | Portfolio",
                  "description": "Official engineering portfolio of Divine Chibueze Nnaji (Navie) - Fullstack Software Engineer & AI Systems Builder.",
                  "publisher": {
                    "@id": "https://divinethe.dev/#person"
                  },
                  "inLanguage": "en"
                },
                {
                  "@type": "ProfilePage",
                  "@id": "https://divinethe.dev/#profilepage",
                  "url": "https://divinethe.dev",
                  "name": "About Divine Chibueze Nnaji",
                  "isPartOf": {
                    "@id": "https://divinethe.dev/#website"
                  },
                  "mainEntity": {
                    "@id": "https://divinethe.dev/#person"
                  }
                }
              ]
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased relative bg-[#000000] text-[#ccd6f6]">
        {/* Ambient Fluid Glow Meshes for Liquid Glass Refraction */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(var(--color-accent-rgb,100,255,218),0.07)_0%,transparent_70%)] blur-[120px]" />
          <div className="absolute top-1/3 -right-32 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.05)_0%,transparent_70%)] blur-[140px]" />
          <div className="absolute top-2/3 -left-32 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.04)_0%,transparent_70%)] blur-[130px]" />
          <div className="absolute -bottom-32 right-1/4 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(var(--color-accent-rgb,100,255,218),0.06)_0%,transparent_70%)] blur-[120px]" />
        </div>
        <div className="relative z-[2]">
          {children}
        </div>
      </body>
    </html>
  );
}
