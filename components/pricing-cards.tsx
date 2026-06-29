"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Check, Zap, CreditCard } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "₱1,499",
    usd: "$27",
    period: "/month",
    description: "Perfect for solo entrepreneurs and small shops just getting online.",
    popular: false,
    features: [
      "1 Website Builder",
      "5 SEO Audits/month",
      "30 AI Content pieces/month",
      "Basic Analytics Dashboard",
      "Email Support",
      "GCash & Maya Payments",
      "1 User Account",
    ],
  },
  {
    name: "Growth",
    price: "₱2,999",
    usd: "$54",
    period: "/month",
    description: "For growing businesses that need more power and more clients.",
    popular: true,
    features: [
      "3 Website Builders",
      "Unlimited SEO Audits",
      "200 AI Content pieces/month",
      "Advanced Analytics + Reports",
      "Client Management (up to 20)",
      "Priority Email & Chat Support",
      "GCash / Maya / Card Payments",
      "Custom Domain Support",
      "PDF Report Exports",
    ],
  },
  {
    name: "Pro",
    price: "₱4,999",
    usd: "$90",
    period: "/month",
    description: "For digital agencies and power users who want to resell to clients.",
    popular: false,
    features: [
      "Unlimited Website Builders",
      "Unlimited SEO Audits",
      "Unlimited AI Content",
      "White-Label PDF Reports",
      "Unlimited Clients",
      "Dedicated Account Manager",
      "All Payment Methods",
      "API Access",
      "Custom Integrations",
      "Team Accounts (5 users)",
    ],
  },
]

export function PricingCards() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="bg-amber-50 text-amber-700 border-amber-100 mb-4">Simple Pricing</Badge>
          <h2 className="text-4xl font-bold">Invest in Your Business Growth</h2>
          <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Transparent pricing in Philippine Pesos. Accept GCash, Maya, and card payments.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 bg-green-50 text-green-700 rounded-full px-5 py-2 text-sm font-medium border border-green-100">
            <Zap className="w-4 h-4" />
            56 Growth plan clients = ₱167,944/month (~$3,000 USD) 🎯
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={plan.popular ? "md:-mt-4" : ""}
            >
              <Card className={`relative h-full transition-shadow ${plan.popular ? "border-blue-500 border-2 shadow-xl shadow-blue-100" : "border-border hover:shadow-md"}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white shadow-md px-4 py-1 text-sm">⭐ Most Popular</Badge>
                  </div>
                )}
                <CardHeader className={`pb-4 ${plan.popular ? "pt-10" : "pt-6"}`}>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="flex items-baseline gap-1 pt-4">
                    <span className="text-4xl font-black">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                    <span className="text-xs text-muted-foreground ml-1">({plan.usd})</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <Link href="/signup">
                    <Button
                      className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.popular ? "Start Free Trial →" : "Get Started →"}
                    </Button>
                  </Link>
                  <div className="space-y-2.5">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Payment methods */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground text-sm mb-4">Accepted payment methods:</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">G</div>
              GCash
            </div>
            <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">M</div>
              Maya
            </div>
            <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              Credit / Debit Card
            </div>
            <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm">
              <span className="text-base">🏦</span>
              Bank Transfer
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">✓ 14-day free trial &nbsp;·&nbsp; ✓ Cancel anytime &nbsp;·&nbsp; ✓ No hidden fees</p>
        </motion.div>
      </div>
    </section>
  )
}
