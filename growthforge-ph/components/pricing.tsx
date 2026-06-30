"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentModal } from "@/components/payment-modal";
import { CheckCircle, Star } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "₱9,999",
    amount: 999900,
    period: "/month",
    tagline: "Perfect for new businesses",
    badge: null,
    features: [
      "1 Social Media Platform Managed",
      "Basic Website (5 pages)",
      "Google Business Profile Setup",
      "Monthly Analytics Report",
      "Email & Chat Support",
      "Free Business Audit",
    ],
    cta: "Get Started",
    popular: false,
    cardBorder: "border-gray-200",
    ctaClass: "bg-blue-700 hover:bg-blue-800 text-white",
  },
  {
    name: "Growth",
    price: "₱24,999",
    amount: 2499900,
    period: "/month",
    tagline: "For businesses serious about scaling",
    badge: "Most Popular",
    features: [
      "3 Social Media Platforms",
      "Custom Website + Blog",
      "Google & Facebook Ads (setup incl.)",
      "Reputation Management",
      "Lead Generation Funnel",
      "Bi-Weekly Strategy Calls",
      "Dedicated Account Manager",
      "Weekly Analytics Reports",
    ],
    cta: "Start Growing Now",
    popular: true,
    cardBorder: "border-blue-600",
    ctaClass: "bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold",
  },
  {
    name: "Enterprise",
    price: "Custom",
    amount: 0,
    period: "",
    tagline: "Full-suite for established SMBs",
    badge: null,
    features: [
      "Everything in Growth",
      "Full Brand Identity Package",
      "eCommerce Website",
      "Advanced SEO Campaign",
      "Video Content Production",
      "Weekly 1-on-1 Consulting",
      "Priority 24/7 Support",
      "Custom Reporting Dashboard",
    ],
    cta: "Let's Talk",
    popular: false,
    cardBorder: "border-gray-200",
    ctaClass: "bg-blue-700 hover:bg-blue-800 text-white",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-1 text-sm">
            Transparent Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900">
            Plans Built for{" "}
            <span className="text-amber-500">Philippine Budgets</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Pay securely via <span className="font-semibold text-blue-600">GCash</span>,{" "}
            <span className="font-semibold text-green-600">Maya</span>, or any debit/credit card. No hidden fees. Cancel anytime.
          </p>
          {/* Payment logos */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {[
              { label: "GCash", color: "bg-blue-100 text-blue-700 border-blue-200" },
              { label: "Maya", color: "bg-green-100 text-green-700 border-green-200" },
              { label: "Visa", color: "bg-blue-50 text-blue-600 border-blue-100" },
              { label: "Mastercard", color: "bg-red-50 text-red-600 border-red-100" },
              { label: "GrabPay", color: "bg-green-50 text-green-600 border-green-100" },
            ].map((p) => (
              <span
                key={p.label}
                className={`px-3 py-1 rounded-full text-xs font-bold border ${p.color}`}
              >
                {p.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex"
            >
              <Card
                className={`flex flex-col w-full border-2 ${plan.cardBorder} ${
                  plan.popular
                    ? "shadow-2xl shadow-blue-200 scale-105"
                    : "shadow-md"
                } overflow-hidden transition-all hover:shadow-xl`}
              >
                {plan.popular && (
                  <div className="gradient-hero px-4 py-2 flex items-center justify-center gap-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-white text-sm font-bold">Most Popular Choice</span>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="space-y-2">
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                      {plan.name}
                    </p>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-extrabold text-blue-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-400 mb-1">{plan.period}</span>
                    </div>
                    <p className="text-gray-500 text-sm">{plan.tagline}</p>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col gap-6">
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA — payment modal for Starter/Growth, contact link for Enterprise */}
                  {plan.amount > 0 ? (
                    <PaymentModal
                      planName={plan.name}
                      planPrice={plan.price}
                      planAmount={plan.amount}
                      ctaClass={plan.ctaClass}
                      ctaLabel={plan.cta}
                    />
                  ) : (
                    <a href="#contact">
                      <Button
                        className={`w-full py-6 text-base rounded-xl ${plan.ctaClass}`}
                      >
                        {plan.cta}
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Guarantee strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm">
            🔒 All plans include a{" "}
            <span className="font-semibold text-blue-700">30-day satisfaction guarantee</span>.
            Not happy? We'll refund you, no questions asked.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
