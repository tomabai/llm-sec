import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Analytics } from '@vercel/analytics/react';
import { PostHogProvider } from "@/components/PostHogProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LLM Security Labs Playground",
  description: "Interactive playground to test and learn about LLM security risks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
