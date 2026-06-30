"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { calculateAuditScore } from "@/lib/audit-score";
import {
  User, Building, Globe, TrendingUp,
  ChevronRight, ChevronLeft, Loader2, CheckCircle,
} from "lucide-react";
import type { AuditAnswers, AuditScores } from "@/types";

// ── Types ────────────────────────────────────────────────────────────────────

export interface Step1 {
  name: string; email: string; phone: string; businessName: string; city: string;
}
export interface Step2 {
  industry: string; yearsInBusiness: string; employees: string;
  monthlyRevenue: string; biggestChallenge: string;
}

interface AuditFormProps {
  onComplete: (scores: AuditScores, formData: Step1 & Step2 & { answers: AuditAnswers }) => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PLATFORMS = [
  { id: "facebook", label: "Facebook", emoji: "📘" },
  { id: "instagram", label: "Instagram", emoji: "📸" },
  { id: "tiktok", label: "TikTok", emoji: "🎵" },
  { id: "youtube", label: "YouTube", emoji: "▶️" },
  { id: "linkedin", label: "LinkedIn", emoji: "💼" },
  { id: "twitter", label: "X / Twitter", emoji: "🐦" },
];

const ADS_PLATFORMS = [
  { id: "facebook", label: "Facebook / Instagram Ads", emoji: "📘" },
  { id: "google", label: "Google Ads", emoji: "🔍" },
  { id: "tiktok", label: "TikTok Ads", emoji: "🎵" },
];

const GOALS = [
  { value: "more-leads", label: "Get more customers & leads" },
  { value: "brand-awareness", label: "Build brand awareness" },
  { value: "reputation", label: "Improve online reputation / reviews" },
  { value: "website", label: "Get a professional website" },
  { value: "social", label: "Grow on social media" },
  { value: "revenue", label: "Increase overall revenue" },
];

const STEPS = [
  { label: "Contact Info", icon: User },
  { label: "Your Business", icon: Building },
  { label: "Digital Presence", icon: Globe },
  { label: "Your Goals", icon: TrendingUp },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function RadioGroup({
  options, value, onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl border-2 text-left text-sm font-medium transition-all",
            value === opt.value
              ? "border-blue-600 bg-blue-50 text-blue-800"
              : "border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50/30"
          )}
        >
          <div className={cn(
            "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
            value === opt.value ? "border-blue-600" : "border-gray-300"
          )}>
            {value === opt.value && (
              <div className="w-2 h-2 rounded-full bg-blue-600" />
            )}
          </div>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function CheckboxGroup({
  options, values, onChange, maxLabel,
}: {
  options: { id: string; label: string; emoji: string }[];
  values: string[];
  onChange: (vals: string[]) => void;
  maxLabel?: string;
}) {
  const toggle = (id: string) => {
    if (values.includes(id)) onChange(values.filter((v) => v !== id));
    else onChange([...values, id]);
  };
  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {options.map((opt) => {
        const checked = values.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border-2 text-left text-sm font-medium transition-all",
              checked
                ? "border-blue-600 bg-blue-50 text-blue-800"
                : "border-gray-200 bg-white text-gray-600 hover:border-blue-200"
            )}
          >
            <div className={cn(
              "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0",
              checked ? "border-blue-600 bg-blue-600" : "border-gray-300"
            )}>
              {checked && <CheckCircle className="w-3 h-3 text-white" />}
            </div>
            <span>{opt.emoji}</span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function AuditForm({ onComplete }: AuditFormProps) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);

  const [step1, setStep1] = useState<Step1>({
    name: "", email: "", phone: "", businessName: "", city: "",
  });
  const [step2, setStep2] = useState<Step2>({
    industry: "", yearsInBusiness: "", employees: "",
    monthlyRevenue: "", biggestChallenge: "",
  });
  const [answers, setAnswers] = useState<AuditAnswers>({
    hasWebsite: "", isMobileFriendly: "", hasGoogleBusiness: "",
    platforms: [], postingFrequency: "",
    hasReviews: "", respondsToReviews: "", runningAds: [],
    primaryGoal: "", monthlyBudget: "",
  });

  const setA = <K extends keyof AuditAnswers>(key: K, val: AuditAnswers[K]) =>
    setAnswers((prev) => ({ ...prev, [key]: val }));

  const goNext = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };
  const goPrev = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const scores = calculateAuditScore(answers);
    const payload = { ...step1, ...step2, answers, scores };

    // Fire & forget — save to DB
    fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(console.error);

    // Slight delay for UX
    await new Promise((r) => setTimeout(r, 1000));
    onComplete(scores, payload);
  };

  const canNext0 = step1.name && step1.email && step1.businessName && step1.city;
  const canNext1 = step2.industry && step2.yearsInBusiness && step2.employees;
  const canNext2 = answers.hasWebsite && answers.hasGoogleBusiness && answers.postingFrequency && answers.hasReviews;
  const canSubmit = answers.primaryGoal && answers.monthlyBudget;

  return (
    <div className="w-full">
      {/* Step progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex-1 flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-all font-bold text-sm",
                  i < step ? "bg-green-500 text-white" :
                  i === step ? "bg-blue-700 text-white shadow-lg shadow-blue-300" :
                  "bg-gray-100 text-gray-400"
                )}>
                  {i < step ? <CheckCircle className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                </div>
                <span className={cn(
                  "text-xs font-medium hidden sm:block",
                  i === step ? "text-blue-700" : i < step ? "text-green-600" : "text-gray-400"
                )}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-2 transition-all",
                  i < step ? "bg-green-400" : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-gray-400 text-xs">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.25 }}
        >
          {/* ── Step 0: Contact Info ─────────────────────────────────────────── */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-blue-900">Tell Us About Yourself</h3>
                <p className="text-gray-500 text-sm mt-1">We'll send your personalized audit report here.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-gray-700 font-medium text-sm">Full Name *</Label>
                  <Input id="name" placeholder="Juan dela Cruz" value={step1.name}
                    onChange={(e) => setStep1((p) => ({ ...p, name: e.target.value }))}
                    className="border-gray-200" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bizname" className="text-gray-700 font-medium text-sm">Business Name *</Label>
                  <Input id="bizname" placeholder="Juan's Restaurant" value={step1.businessName}
                    onChange={(e) => setStep1((p) => ({ ...p, businessName: e.target.value }))}
                    className="border-gray-200" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-gray-700 font-medium text-sm">Email Address *</Label>
                  <Input id="email" type="email" placeholder="juan@business.com" value={step1.email}
                    onChange={(e) => setStep1((p) => ({ ...p, email: e.target.value }))}
                    className="border-gray-200" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-gray-700 font-medium text-sm">Phone / Viber</Label>
                  <Input id="phone" placeholder="+63 9XX XXX XXXX" value={step1.phone}
                    onChange={(e) => setStep1((p) => ({ ...p, phone: e.target.value }))}
                    className="border-gray-200" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="city" className="text-gray-700 font-medium text-sm">City / Location *</Label>
                <Input id="city" placeholder="e.g. Cebu City, Quezon City, Davao..." value={step1.city}
                  onChange={(e) => setStep1((p) => ({ ...p, city: e.target.value }))}
                  className="border-gray-200" />
              </div>
            </div>
          )}

          {/* ── Step 1: Business Profile ─────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-blue-900">About Your Business</h3>
                <p className="text-gray-500 text-sm mt-1">Help us understand your business context.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-medium text-sm">Industry *</Label>
                  <Select value={step2.industry} onValueChange={(v) => setStep2((p) => ({ ...p, industry: v }))}>
                    <SelectTrigger className="border-gray-200"><SelectValue placeholder="Select industry..." /></SelectTrigger>
                    <SelectContent>
                      {["Restaurant / Food & Beverage", "Retail / Shopping", "Beauty & Wellness", "Real Estate", "Healthcare / Medical", "Construction", "Education / Tutoring", "Finance / Insurance", "Travel & Tourism", "Professional Services", "Automotive", "Other"].map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-medium text-sm">Years in Business *</Label>
                  <Select value={step2.yearsInBusiness} onValueChange={(v) => setStep2((p) => ({ ...p, yearsInBusiness: v }))}>
                    <SelectTrigger className="border-gray-200"><SelectValue placeholder="How long?" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<1">Less than 1 year</SelectItem>
                      <SelectItem value="1-3">1–3 years</SelectItem>
                      <SelectItem value="3-5">3–5 years</SelectItem>
                      <SelectItem value="5+">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-medium text-sm">Number of Employees *</Label>
                  <Select value={step2.employees} onValueChange={(v) => setStep2((p) => ({ ...p, employees: v }))}>
                    <SelectTrigger className="border-gray-200"><SelectValue placeholder="Team size?" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Just me (solo)</SelectItem>
                      <SelectItem value="2-5">2–5 employees</SelectItem>
                      <SelectItem value="6-20">6–20 employees</SelectItem>
                      <SelectItem value="21-50">21–50 employees</SelectItem>
                      <SelectItem value="50+">50+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-medium text-sm">Est. Monthly Revenue</Label>
                  <Select value={step2.monthlyRevenue} onValueChange={(v) => setStep2((p) => ({ ...p, monthlyRevenue: v }))}>
                    <SelectTrigger className="border-gray-200"><SelectValue placeholder="Revenue range?" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<50k">Below ₱50,000</SelectItem>
                      <SelectItem value="50k-200k">₱50,000 – ₱200,000</SelectItem>
                      <SelectItem value="200k-1m">₱200,000 – ₱1,000,000</SelectItem>
                      <SelectItem value=">1m">Above ₱1,000,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-700 font-medium text-sm">What is your biggest business challenge right now?</Label>
                <Textarea placeholder="e.g. Not getting enough customers, hard to compete with bigger brands, don't know how to market online..."
                  value={step2.biggestChallenge}
                  onChange={(e) => setStep2((p) => ({ ...p, biggestChallenge: e.target.value }))}
                  rows={3} className="border-gray-200 resize-none" />
              </div>
            </div>
          )}

          {/* ── Step 2: Digital Presence ─────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-blue-900">Your Digital Presence</h3>
                <p className="text-gray-500 text-sm mt-1">Be honest — this helps us give you accurate recommendations.</p>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold text-sm">Do you have a business website? *</Label>
                <RadioGroup value={answers.hasWebsite} onChange={(v) => setA("hasWebsite", v as AuditAnswers["hasWebsite"])}
                  options={[{ value: "yes", label: "Yes, I have a website" }, { value: "no", label: "No, not yet" }]} />
              </div>

              {answers.hasWebsite === "yes" && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-sm">Is your website mobile-friendly?</Label>
                  <RadioGroup value={answers.isMobileFriendly} onChange={(v) => setA("isMobileFriendly", v as AuditAnswers["isMobileFriendly"])}
                    options={[{ value: "yes", label: "Yes, it works on mobile" }, { value: "no", label: "No / Looks bad on mobile" }, { value: "not-sure", label: "Not sure" }]} />
                </motion.div>
              )}

              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold text-sm">Are you on Google Business Profile (Google Maps)? *</Label>
                <RadioGroup value={answers.hasGoogleBusiness} onChange={(v) => setA("hasGoogleBusiness", v as AuditAnswers["hasGoogleBusiness"])}
                  options={[{ value: "yes", label: "Yes, I'm on Google Maps" }, { value: "no", label: "No, I'm not listed" }, { value: "not-sure", label: "Not sure" }]} />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold text-sm">Which social media platforms are you on?</Label>
                <CheckboxGroup options={PLATFORMS} values={answers.platforms}
                  onChange={(v) => setA("platforms", v)} />
              </div>

              {answers.platforms.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-sm">How often do you post on social media? *</Label>
                  <RadioGroup value={answers.postingFrequency} onChange={(v) => setA("postingFrequency", v as AuditAnswers["postingFrequency"])}
                    options={[{ value: "regularly", label: "Regularly (3-7x/week)" }, { value: "sometimes", label: "Sometimes (1-2x/week)" }, { value: "rarely", label: "Rarely (a few times/month)" }, { value: "never", label: "Almost never" }]} />
                </motion.div>
              )}

              {answers.platforms.length === 0 && (
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-sm">Posting frequency *</Label>
                  <RadioGroup value={answers.postingFrequency} onChange={(v) => setA("postingFrequency", v as AuditAnswers["postingFrequency"])}
                    options={[{ value: "regularly", label: "Regularly (3-7x/week)" }, { value: "sometimes", label: "Sometimes (1-2x/week)" }, { value: "rarely", label: "Rarely (a few times/month)" }, { value: "never", label: "Not at all" }]} />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold text-sm">Do you have customer reviews online (Google, Facebook)? *</Label>
                <RadioGroup value={answers.hasReviews} onChange={(v) => setA("hasReviews", v as AuditAnswers["hasReviews"])}
                  options={[{ value: "many", label: "Yes, many (10+)" }, { value: "few", label: "A few (1-9)" }, { value: "none", label: "None yet" }]} />
              </div>

              {answers.hasReviews !== "none" && answers.hasReviews !== "" && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-sm">Do you respond to customer reviews?</Label>
                  <RadioGroup value={answers.respondsToReviews} onChange={(v) => setA("respondsToReviews", v as AuditAnswers["respondsToReviews"])}
                    options={[{ value: "yes", label: "Yes, I reply to reviews" }, { value: "no", label: "No, I don't respond" }]} />
                </motion.div>
              )}

              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold text-sm">Are you running any paid advertising?</Label>
                <CheckboxGroup options={ADS_PLATFORMS} values={answers.runningAds}
                  onChange={(v) => setA("runningAds", v)} />
                <button type="button"
                  onClick={() => setA("runningAds", answers.runningAds.includes("none") ? [] : ["none"])}
                  className={cn("w-full text-left p-3 rounded-xl border-2 text-sm font-medium transition-all",
                    answers.runningAds.includes("none") ? "border-blue-600 bg-blue-50 text-blue-800" : "border-gray-200 text-gray-600 hover:border-blue-200")}>
                  ❌ Not running any ads
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Goals ────────────────────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-blue-900">Your Goals & Budget</h3>
                <p className="text-gray-500 text-sm mt-1">This helps us tailor your audit to what matters most.</p>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold text-sm">What is your #1 goal right now? *</Label>
                <div className="grid gap-2">
                  {GOALS.map((g) => (
                    <button key={g.value} type="button"
                      onClick={() => setA("primaryGoal", g.value)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border-2 text-left text-sm font-medium transition-all",
                        answers.primaryGoal === g.value
                          ? "border-blue-600 bg-blue-50 text-blue-800"
                          : "border-gray-200 text-gray-600 hover:border-blue-200"
                      )}>
                      <div className={cn("w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                        answers.primaryGoal === g.value ? "border-blue-600" : "border-gray-300")}>
                        {answers.primaryGoal === g.value && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                      </div>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold text-sm">Monthly budget for digital marketing? *</Label>
                <RadioGroup value={answers.monthlyBudget} onChange={(v) => setA("monthlyBudget", v)}
                  options={[
                    { value: "<5k", label: "Below ₱5,000" },
                    { value: "5k-15k", label: "₱5,000 – ₱15,000" },
                    { value: "15k-30k", label: "₱15,000 – ₱30,000" },
                    { value: ">30k", label: "₱30,000+" },
                  ]} />
              </div>

              {/* Preview teaser */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white space-y-2">
                <p className="font-bold text-lg">🎯 Almost there!</p>
                <p className="text-blue-100 text-sm">
                  Click "Generate My Audit" to receive your personalized Digital Score — including category breakdowns and your top quick wins.
                </p>
                <div className="flex gap-3 text-xs text-blue-200 pt-1">
                  <span>✓ Instant results</span>
                  <span>✓ 100% Free</span>
                  <span>✓ No credit card</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8 gap-4">
        {step > 0 ? (
          <Button variant="outline" onClick={goPrev} className="border-gray-200 text-gray-600">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <Button
            onClick={goNext}
            disabled={
              (step === 0 && !canNext0) ||
              (step === 1 && !canNext1) ||
              (step === 2 && !canNext2)
            }
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6"
          >
            Continue <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-8 shadow-lg shadow-amber-200"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
            ) : (
              <>🔍 Generate My Free Audit</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
