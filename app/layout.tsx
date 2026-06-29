import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "VanRoute Pro — Live Delivery Logistics Network",
  description:
    "Find cargo van and sprinter van delivery opportunities in South Carolina, North Carolina, and Georgia. Live load board, built-in GPS routing, online payments.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} font-sans bg-slate-950 text-white antialiased`}>
        <Navbar />
        {children}
        <footer className="border-t border-slate-800 bg-slate-950 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-white">
                    Van<span className="text-orange-500">Route</span>{" "}
                    <span className="text-slate-500 text-sm font-normal">Pro</span>
                  </span>
                </div>
                <p className="text-slate-400 text-sm max-w-xs">
                  Professional logistics network for cargo van and sprinter van
                  owner-operators across SC, NC &amp; GA.
                </p>
                <p className="text-slate-600 text-xs mt-4">USA Based · Serving the Southeast Region</p>
              </div>
              <div>
                <p className="text-slate-300 font-semibold text-sm mb-3">Platform</p>
                <div className="space-y-2 text-sm text-slate-500">
                  <p>Live Load Board</p>
                  <p>Post a Delivery</p>
                  <p>Driver Portal</p>
                  <p>Shipper Portal</p>
                </div>
              </div>
              <div>
                <p className="text-slate-300 font-semibold text-sm mb-3">Coverage</p>
                <div className="space-y-2 text-sm text-slate-500">
                  <p>South Carolina</p>
                  <p>North Carolina</p>
                  <p>Georgia</p>
                  <p className="text-orange-500/70 text-xs">More states coming soon</p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-slate-600 text-xs">
                © 2026 VanRoute Pro. All rights reserved. USA-based logistics platform.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span>Cargo Vans</span>
                <span>·</span>
                <span>Sprinter Vans</span>
                <span>·</span>
                <span>Owner Operators</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
