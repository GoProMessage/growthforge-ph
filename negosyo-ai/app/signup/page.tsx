"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Check, Calendar, Bell, CreditCard, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  { id: "starter", name: "Starter", price: "₱1,499/mo", usd: "$27", features: ["1 Website", "5 SEO Audits/mo", "50 AI Content pieces", "Basic Analytics"] },
  { id: "growth", name: "Growth", price: "₱2,999/mo", usd: "$54", popular: true, features: ["3 Websites", "Unlimited SEO Audits", "200 AI Content pieces", "Advanced Analytics", "Priority Support"] },
  { id: "pro", name: "Pro", price: "₱4,999/mo", usd: "$89", features: ["10 Websites", "Unlimited everything", "White-label reports", "API Access", "24/7 Support"] },
]

const steps = ["Choose Plan", "Your Details", "Get Started"]

function getTrialEndDate() {
  const d = new Date()
  d.setDate(d.getDate() + 14)
  return d.toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })
}

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState("growth")
  const plan = plans.find(p => p.id === selectedPlan)!

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-2xl space-y-6">

        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-blue-600">Negosyo</span>
            <span className="text-amber-500">AI</span>
          </Link>
          <p className="text-muted-foreground mt-1 text-sm">
            14-day free trial · <strong className="text-green-600">No payment info required</strong>
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                step === i + 1 ? "bg-blue-600 text-white" :
                step > i + 1 ? "bg-green-100 text-green-700" :
                "bg-gray-100 text-gray-400"
              )}>
                {step > i + 1
                  ? <Check className="w-3.5 h-3.5" />
                  : <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center text-xs">{i + 1}</span>
                }
                <span className="hidden sm:inline">{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn("w-8 h-0.5 rounded", step > i + 1 ? "bg-green-400" : "bg-gray-200")} />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1: Choose Plan ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {plans.map((p) => (
                <Card
                  key={p.id}
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedPlan === p.id
                      ? "border-blue-500 ring-2 ring-blue-200 shadow-md"
                      : "hover:border-blue-200 hover:shadow-sm"
                  )}
                  onClick={() => setSelectedPlan(p.id)}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-base">{p.name}</div>
                        <div className="text-lg font-black text-blue-600">{p.price}</div>
                        <div className="text-xs text-gray-400">{p.usd}/mo</div>
                      </div>
                      {p.popular && <Badge className="bg-blue-600 text-white border-0 text-xs">Popular</Badge>}
                    </div>
                    <ul className="space-y-1.5">
                      {p.features.map((f) => (
                        <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-green-500 flex-shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    {selectedPlan === p.id && (
                      <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                        <Check className="w-3.5 h-3.5" /> Selected
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Trial reminder — shown on plan selection */}
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3 text-sm">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <span className="font-semibold text-green-700">14-day free trial — zero payment info needed.</span>
                <span className="text-green-600"> You can try any plan at no cost. We&apos;ll only ask for payment details 3 days before your trial ends.</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Your Details ── */}
        {step === 2 && (
          <Card className="shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tell us about your business</h2>
                <p className="text-sm text-muted-foreground mt-0.5">No payment info required — just the basics to get started.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="Juan dela Cruz" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" placeholder="juan@negosyo.com" className="h-11" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input placeholder="My Awesome Business" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>City / Location</Label>
                <Input placeholder="e.g. Cebu City, Manila, Davao" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" placeholder="Create a strong password (8+ chars)" className="h-11" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Step 3: You're All Set! ── */}
        {step === 3 && (
          <Card className="shadow-lg border-green-200">
            <CardContent className="p-6 space-y-6">
              {/* Success header */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">You&apos;re all set! 🎉</h2>
                <p className="text-muted-foreground">Your 14-day free trial starts the moment you click below.</p>
              </div>

              {/* Plan summary */}
              <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-500 font-medium">SELECTED PLAN</p>
                  <p className="font-bold text-blue-700">{plan.name} — {plan.price}</p>
                </div>
                <Badge className="bg-green-100 text-green-700 border-0 font-semibold text-sm">
                  FREE for 14 days
                </Badge>
              </div>

              {/* What happens next */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">What happens next:</p>
                <div className="space-y-3">
                  {[
                    {
                      icon: Zap,
                      color: "bg-blue-100 text-blue-600",
                      title: "Today — Start your free trial",
                      desc: "Full access to all features. No payment info needed.",
                    },
                    {
                      icon: Bell,
                      color: "bg-amber-100 text-amber-600",
                      title: `Day 11 — Reminder email`,
                      desc: "We'll email you 3 days before your trial ends with a link to set up payment.",
                    },
                    {
                      icon: Calendar,
                      color: "bg-purple-100 text-purple-600",
                      title: `Day 14 — Trial ends (${getTrialEndDate()})`,
                      desc: "Only then will we ask for your GCash, Maya, or card to continue.",
                    },
                    {
                      icon: CreditCard,
                      color: "bg-green-100 text-green-600",
                      title: "Cancel anytime before Day 14",
                      desc: "No charge ever. No questions asked. You keep everything you created.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${item.color}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center text-xs text-gray-400">
                By starting your trial you agree to our <span className="underline cursor-pointer">Terms of Service</span>. We will never charge you without sending a reminder first.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 1 && step < 3 && (
            <Button variant="outline" className="flex-1 h-11" onClick={() => setStep(step - 1)}>
              ← Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-base font-semibold"
              onClick={() => setStep(step + 1)}
            >
              Continue →
            </Button>
          ) : (
            <Link href="/dashboard" className="w-full">
              <Button className="w-full h-12 bg-green-600 hover:bg-green-700 text-base font-bold shadow-lg shadow-green-200 gap-2">
                <Zap className="w-5 h-5" />
                Start My Free Trial — No Payment Needed
              </Button>
            </Link>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
