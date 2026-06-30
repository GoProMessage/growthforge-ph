"use client";

import Link from "next/link";
import { Zap, Facebook, Mail, Phone } from "lucide-react";

const services = [
  "Lead Generation",
  "Website Design",
  "Reputation Management",
  "Brand Building",
  "Social Media Management",
  "Business Consulting",
];

const locations = [
  "Metro Manila",
  "Cebu City",
  "Davao City",
  "Iloilo City",
  "Baguio City",
  "Nationwide",
];

export function Footer() {
  return (
    <footer className="gradient-hero text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-900" />
              </div>
              <span className="font-bold text-xl">
                GrowthForge <span className="text-amber-400">PH</span>
              </span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Helping Philippine small and medium businesses grow online through
              lead generation, brand building, and digital marketing.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-amber-400 hover:text-blue-900 rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@growthforgeph.com"
                className="w-9 h-9 bg-white/10 hover:bg-amber-400 hover:text-blue-900 rounded-lg flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="tel:+639171234567"
                className="w-9 h-9 bg-white/10 hover:bg-amber-400 hover:text-blue-900 rounded-lg flex items-center justify-center transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-amber-400">
              Our Services
            </h4>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    className="text-blue-200 text-sm hover:text-amber-400 transition-colors"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-amber-400">
              Serving All PH
            </h4>
            <ul className="space-y-2">
              {locations.map((l) => (
                <li key={l}>
                  <span className="text-blue-200 text-sm">📍 {l}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-amber-400">
              Contact
            </h4>
            <div className="space-y-3 text-sm text-blue-200">
              <p>
                📞{" "}
                <a
                  href="tel:+639171234567"
                  className="hover:text-amber-400 transition-colors"
                >
                  +63 917 123 4567
                </a>
              </p>
              <p>
                📧{" "}
                <a
                  href="mailto:hello@growthforgeph.com"
                  className="hover:text-amber-400 transition-colors"
                >
                  hello@growthforgeph.com
                </a>
              </p>
              <p>⏰ Mon–Sat: 9AM – 6PM PST</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4 space-y-2">
              <p className="text-white font-semibold text-sm">🎁 Free Offer</p>
              <p className="text-blue-200 text-xs">
                Get a FREE digital audit of your business. Limited slots available!
              </p>
              <a
                href="#contact"
                className="inline-block bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold text-xs px-4 py-2 rounded-lg transition-colors"
              >
                Claim Your Free Audit →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-blue-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-blue-300 text-sm">
            © {new Date().getFullYear()} GrowthForge PH. All rights reserved. 🇵🇭
          </p>
          <div className="flex items-center gap-4 text-blue-300 text-sm">
            <a href="#" className="hover:text-amber-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-amber-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
