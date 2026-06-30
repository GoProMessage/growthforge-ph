import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LandingNav } from "@/components/landing-nav"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "NegosyoAI — AI-Powered Growth Tools for Filipino Entrepreneurs",
  description:
    "AI-powered SEO audits, content generation, website builder, and GCash/Maya payments — everything Filipino SMEs need to grow to ₱168K+/month.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans bg-white text-gray-900 antialiased`}>
        <LandingNav />
        {children}
      </body>
    </html>
  )
}
