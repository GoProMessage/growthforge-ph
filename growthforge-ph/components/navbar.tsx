"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#process", label: "How It Works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#testimonials", label: "Reviews" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <span className={cn("font-bold text-lg transition-colors", scrolled ? "text-blue-900" : "text-white")}>
              GrowthForge <span className="text-amber-400">PH</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-amber-400",
                  scrolled ? "text-gray-700" : "text-white/90"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Free Audit — highlight CTA */}
            <Link href="/audit">
              <span className={cn(
                "text-sm font-bold px-3 py-1.5 rounded-lg border transition-all",
                scrolled
                  ? "border-amber-400 text-amber-600 hover:bg-amber-50"
                  : "border-amber-400/60 text-amber-300 hover:bg-amber-400/10"
              )}>
                🎁 Free Audit
              </span>
            </Link>

            <Link href="/audit">
              <Button className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-semibold shadow-md text-sm">
                Get Free Consultation
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className={cn("md:hidden p-2 rounded-lg transition-colors", scrolled ? "text-gray-700" : "text-white")}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden bg-white rounded-xl shadow-xl mt-2 mb-4 p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/audit"
              className="block text-amber-600 font-bold py-2 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              🎁 Free Business Audit
            </Link>
            <Link href="/audit" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-amber-400 hover:bg-amber-500 text-blue-900 font-semibold mt-1">
                Get Free Consultation
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
