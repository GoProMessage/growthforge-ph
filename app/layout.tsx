import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// All pages in this app use client-side libraries (charts, animations, maps).
// Force dynamic rendering to skip static pre-generation and avoid RSC
// serialization issues with those packages.
export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GrowthForge PH | Digital Growth Agency for Philippine SMBs",
  description:
    "We help small and medium-sized businesses in the Philippines grow their brand online through lead generation, web design, reputation management, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-white`}>
        {children}
      </body>
    </html>
  );
}
