"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getRecommendations, getScoreLabel } from "@/lib/audit-score";
import { MessageCircle, Phone, ArrowRight, RefreshCw } from "lucide-react";
import type { AuditScores, AuditAnswers } from "@/types";
import { cn } from "@/lib/utils";

interface AuditResultsProps {
  scores: AuditScores;
  answers: AuditAnswers;
  businessName: string;
  name: string;
  onRetake: () => void;
}

const CATEGORIES = [
  { key: "website" as const, label: "Website", emoji: "🌐" },
  { key: "social" as const, label: "Social Media", emoji: "📱" },
  { key: "localSeo" as const, label: "Local SEO", emoji: "📍" },
  { key: "reputation" as const, label: "Online Reputation", emoji: "⭐" },
  { key: "advertising" as const, label: "Paid Advertising", emoji: "🎯" },
];

function getBarColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-blue-500";
  if (score >= 35) return "bg-amber-500";
  return "bg-red-500";
}

function getTextColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 35) return "text-amber-600";
  return "text-red-600";
}

function CircleScore({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0);
  const { label, color } = getScoreLabel(score);

  useEffect(() => {
    let start = 0;
    const timer = setInterval(() => {
      start += 2;
      if (start >= score) {
        setDisplayed(score);
        clearInterval(timer);
      } else {
        setDisplayed(start);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [score]);

  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference - (displayed / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="10" />
        {/* Progress circle */}
        <motion.circle
          cx="60" cy="60" r="52"
          fill="none"
          stroke={score >= 80 ? "#22c55e" : score >= 60 ? "#3b82f6" : score >= 35 ? "#f59e0b" : "#ef4444"}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-4xl font-extrabold", color)}>{displayed}</span>
        <span className="text-gray-400 text-xs font-medium">/ 100</span>
        <span className={cn("text-xs font-bold mt-0.5", color)}>{label}</span>
      </div>
    </div>
  );
}

export function AuditResults({ scores, answers, businessName, name, onRetake }: AuditResultsProps) {
  const { message } = getScoreLabel(scores.overall);
  const recommendations = getRecommendations(scores, answers);
  const firstName = name.split(" ")[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold"
        >
          ✅ Your Audit is Ready, {firstName}!
        </motion.div>
        <h3 className="text-2xl font-extrabold text-blue-900">{businessName}</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto">{message}</p>
      </div>

      {/* Overall score + category breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Circle gauge */}
          <div className="shrink-0">
            <CircleScore score={scores.overall} />
            <p className="text-center text-gray-500 text-xs mt-1 font-medium">Overall Digital Score</p>
          </div>

          {/* Category bars */}
          <div className="flex-1 w-full space-y-3">
            {CATEGORIES.map((cat, i) => {
              const score = scores[cat.key];
              return (
                <motion.div
                  key={cat.key}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-700">
                      {cat.emoji} {cat.label}
                    </span>
                    <span className={cn("font-bold", getTextColor(score))}>
                      {score}/100
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className={cn("h-full rounded-full", getBarColor(score))}
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Score legend */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
          {[
            { color: "bg-red-500", label: "0–34: Critical" },
            { color: "bg-amber-500", label: "35–59: Needs Work" },
            { color: "bg-blue-500", label: "60–79: Good" },
            { color: "bg-green-500", label: "80–100: Excellent" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={cn("w-3 h-3 rounded-full", l.color)} />
              <span className="text-gray-500 text-xs">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-3">
        <h4 className="font-bold text-blue-900 text-lg flex items-center gap-2">
          🔥 Your Top Quick Wins
        </h4>
        {recommendations.map((rec, i) => (
          <motion.div
            key={rec.category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.15 }}
            className={cn(
              "rounded-xl p-4 border-l-4 space-y-1.5",
              rec.priority === "critical"
                ? "bg-red-50 border-red-500"
                : rec.priority === "high"
                ? "bg-amber-50 border-amber-500"
                : "bg-blue-50 border-blue-500"
            )}
          >
            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-800 text-sm">
                {rec.emoji} {rec.title}
              </p>
              <span className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded-full",
                rec.priority === "critical" ? "bg-red-100 text-red-700" :
                rec.priority === "high" ? "bg-amber-100 text-amber-700" :
                "bg-blue-100 text-blue-700"
              )}>
                {rec.priority === "critical" ? "🚨 Critical" : rec.priority === "high" ? "⚠️ High Priority" : "💡 Recommended"}
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{rec.description}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA Block */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="gradient-hero rounded-2xl p-6 text-white space-y-4"
      >
        <div className="space-y-2">
          <p className="font-extrabold text-xl">
            Ready to Fix These Issues? 🚀
          </p>
          <p className="text-blue-100 text-sm leading-relaxed">
            Book a FREE 30-minute strategy call with our team. We'll walk through your audit, explain each recommendation, and give you a clear action plan — absolutely free, no obligation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`https://wa.me/639171234567?text=Hi! I just got my GrowthForge audit score — ${scores.overall}/100 for ${businessName}. I'd like to book my free strategy call!`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5">
              <MessageCircle className="w-4 h-4 mr-2" />
              Book via WhatsApp
            </Button>
          </a>
          <a href="#contact" className="flex-1">
            <Button className="w-full bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold py-5">
              <Phone className="w-4 h-4 mr-2" />
              Schedule a Call
            </Button>
          </a>
        </div>

        <div className="text-center">
          <Link href="/#pricing">
            <Button variant="ghost" className="text-blue-200 hover:text-white hover:bg-white/10 text-sm">
              View Our Plans & Pricing <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Retake */}
      <div className="text-center">
        <button
          onClick={onRetake}
          className="flex items-center gap-1.5 text-gray-400 text-sm hover:text-gray-600 transition-colors mx-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retake the audit
        </button>
      </div>
    </motion.div>
  );
}
