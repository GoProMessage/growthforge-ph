"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AuditForm } from "@/components/audit-form";
import { AuditResults } from "@/components/audit-results";
import { Zap, CheckCircle, ArrowLeft, Globe, Star, TrendingUp, Users, Shield } from "lucide-react";
import type { AuditScores, AuditAnswers } from "@/types";

interface CompletedData {
  scores: AuditScores;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  city: string;
  answers: AuditAnswers;
  [key: string]: unknown;
}

const WHAT_WE_AUDIT = [
  { icon: Globe, label: "Website Health", desc: "Speed, mobile-friendliness, SEO structure" },
  { icon: Users, label: "Social Media Presence", desc: "Platform coverage, posting frequency, engagement" },
  { icon: TrendingUp, label: "Local SEO & Google Visibility", desc: "Google Business Profile, map rankings, keywords" },
  { icon: Star, label: "Online Reputation", desc: "Reviews, ratings, response strategy" },
  { icon: Shield, label: "Digital Advertising", desc: "Paid ads coverage, retargeting, ad spend ROI" },
];

export default function AuditPage() {
  const [completed, setCompleted] = useState<CompletedData | null>(null);

  const handleComplete = (
    scores: AuditScores,
    formData: { name: string; businessName: string; answers: AuditAnswers } & Record<string, unknown>
  ) => {
    setCompleted({ scores, ...formData } as CompletedData);
    // Scroll to results
    setTimeout(() => {
      document.getElementById("audit-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="font-bold text-blue-900 text-sm">
              GrowthForge <span className="text-amber-500">PH</span>
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-gray-500 hover:text-blue-700 text-sm font-medium transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </div>

      {/* Hero banner */}
      <div className="gradient-hero py-14 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 px-4 py-1.5 rounded-full text-sm font-semibold"
          >
            🎁 100% Free — No Credit Card Required
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-white leading-tight"
          >
            Get Your Free{" "}
            <span className="text-amber-400">Business Audit</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-blue-100 text-lg max-w-xl mx-auto leading-relaxed"
          >
            Answer 4 quick steps and instantly see your Digital Score — a complete analysis of your online presence with specific recommendations to grow your business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 pt-2"
          >
            {["Takes only 3 minutes", "Instant results", "Personalized to your business"].map((b) => (
              <div key={b} className="flex items-center gap-2 text-blue-200 text-sm">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                {b}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-5 gap-10 items-start">

          {/* Left sidebar — What We Audit */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-blue-900 text-lg">What We Analyze</h3>
              <div className="space-y-4">
                {WHAT_WE_AUDIT.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-amber-50 border border-amber-100 rounded-2xl p-5 space-y-3"
            >
              <p className="font-bold text-amber-800 text-sm">⭐ What business owners say:</p>
              <blockquote className="text-gray-600 text-sm italic leading-relaxed">
                "I had no idea my digital score was only 32/100! GrowthForge's audit showed me exactly what was missing. Within 3 months of fixing it, my inquiries doubled."
              </blockquote>
              <p className="text-amber-700 font-semibold text-xs">— Rina T., Beauty Salon, Pasig City</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white border border-gray-100 rounded-2xl p-5 space-y-2 shadow-sm"
            >
              <p className="font-bold text-blue-900 text-sm">🔒 We respect your privacy</p>
              <p className="text-gray-500 text-xs leading-relaxed">
                Your information is kept 100% confidential and will never be shared. We'll only use it to contact you about your free audit results.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["No spam", "No selling your data", "Unsubscribe anytime"].map((t) => (
                  <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Form / Results */}
          <div className="lg:col-span-3 order-1 lg:order-2" id="audit-results">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {!completed ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <AuditForm onComplete={handleComplete} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <AuditResults
                      scores={completed.scores}
                      answers={completed.answers}
                      businessName={completed.businessName}
                      name={completed.name}
                      onRetake={() => setCompleted(null)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA strip */}
      {!completed && (
        <div className="border-t border-gray-100 bg-white py-8">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-3">
            <p className="text-gray-500 text-sm">
              Already know what you need?{" "}
              <Link href="/#pricing" className="text-blue-600 font-semibold hover:underline">
                View our plans & pricing →
              </Link>
            </p>
            <p className="text-gray-400 text-xs">
              Over 200 Philippine businesses have used this audit to grow their online presence.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
