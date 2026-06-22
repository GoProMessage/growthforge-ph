"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Star } from "lucide-react";

const benefits = [
  "No long-term contracts",
  "Results in 30 days",
  "Dedicated account manager",
];

export function Hero() {
  return (
    <section className="relative min-h-screen gradient-hero flex items-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-300/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/30 px-3 py-1">
                🇵🇭 Built for Philippine SMBs
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Grow Your Business{" "}
              <span className="text-amber-400">Online</span> with Digital
              Experts
            </h1>

            <p className="text-lg text-blue-100 leading-relaxed max-w-xl">
              We help small and medium businesses across the Philippines generate
              more leads, build a powerful brand, and dominate their local
              market — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact">
                <Button
                  size="lg"
                  className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-8 shadow-xl shadow-amber-400/30 text-base"
                >
                  Start Growing Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <a href="#services">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 text-base bg-transparent"
                >
                  See Our Services
                </Button>
              </a>
            </div>

            <div className="flex flex-wrap gap-4">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-blue-100 text-sm">{b}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right content — floating stats cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            {/* Main card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center text-2xl">
                  📈
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Business Growth</p>
                  <p className="text-blue-200 text-sm">Real results for real businesses</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "SMBs Served", value: "200+" },
                  { label: "Avg. Lead Increase", value: "3.5×" },
                  { label: "Client Retention", value: "94%" },
                  { label: "Years in PH", value: "5+" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/10 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-amber-400">{stat.value}</p>
                    <p className="text-blue-200 text-xs mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Testimonial snippet */}
              <div className="bg-white/10 rounded-xl p-4 space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-blue-100 text-sm italic">
                  "GrowthForge tripled our inquiries in just 6 weeks. Best
                  investment we made!"
                </p>
                <p className="text-amber-400 text-sm font-semibold">
                  — Maria S., Restaurant Owner, Cebu
                </p>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-amber-400 rounded-2xl p-4 shadow-xl"
            >
              <p className="text-blue-900 font-bold text-sm">🔥 Hot Promo</p>
              <p className="text-blue-900 text-xs">Free audit this month!</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 30C1200 80 960 0 720 20C480 40 240 80 0 30L0 80Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
