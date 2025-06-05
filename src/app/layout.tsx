import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Analytics } from '@vercel/analytics/react';
import { PostHogProvider } from "@/components/PostHogProvider";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "LLM Security Labs - Interactive Playground for LLM Security Testing",
    template: "%s | LLM Security Labs"
  },
  description: "Interactive playground to test and learn about LLM security vulnerabilities. Explore OWASP Top 10 LLM risks through hands-on labs, practice prompt injection, and learn security mitigation strategies.",
  keywords: [
    "LLM security",
    "large language model security",
    "prompt injection",
    "AI security",
    "OWASP Top 10 LLM",
    "machine learning security",
    "AI vulnerability testing",
    "cybersecurity education",
    "hands-on learning",
    "security playground"
  ],
  authors: [{ name: "Tom Abai", url: "https://github.com/TomAbai" }],
  creator: "Tom Abai",
  publisher: "LLM Security Labs",
  category: "Education",
  classification: "Cybersecurity Education Platform",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.llm-sec.dev",
    siteName: "LLM Security Labs",
    title: "LLM Security Labs - Interactive Playground for LLM Security Testing",
    description: "Master LLM security through interactive labs. Practice prompt injection, explore OWASP Top 10 LLM vulnerabilities, and learn to secure AI applications in a safe environment.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LLM Security Labs - Interactive Learning Platform",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@llmseclabs",
    creator: "@tomabai",
    title: "LLM Security Labs - Interactive Playground for LLM Security Testing",
    description: "Master LLM security through interactive labs. Practice prompt injection, explore OWASP Top 10 LLM vulnerabilities, and learn to secure AI applications.",
    images: ["/twitter-card.png"]
  },

  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code"
  },
  alternates: {
    canonical: "https://www.llm-sec.dev",
    languages: {
      "en-US": "https://www.llm-sec.dev",
    }
  },
  other: {
    "application-name": "LLM Security Labs",
    "apple-mobile-web-app-title": "LLM Security Labs",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "LLM Security Labs",
    "description": "Interactive playground to test and learn about LLM security vulnerabilities",
    "url": "https://www.llm-sec.dev",
    "sameAs": [
      "https://github.com/TomAbai/llm-sec"
    ],
    "founder": {
      "@type": "Person",
      "name": "Tom Abai"
    },
    "educationalCredentialAwarded": "Certificate of Completion",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "LLM Security Course Catalog",
      "itemListElement": [
        {
          "@type": "Course",
          "name": "OWASP Top 10 LLM Vulnerabilities",
          "description": "Interactive labs covering the top 10 LLM security vulnerabilities",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "LLM Security Labs"
          }
        }
      ]
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e293b" />
        <meta name="msapplication-TileColor" content="#1e293b" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>
        <PostHogProvider>
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
          <Footer />
          <Analytics />
        </PostHogProvider>
      </body>
    </html>
  );
}
