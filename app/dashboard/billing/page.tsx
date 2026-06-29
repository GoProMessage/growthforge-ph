"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Check, CreditCard, Zap, TrendingUp, Download, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    id: "starter", name: "Starter", price: 1499, usd: 27,
    features: ["1 Website Builder", "5 SEO Audits/mo", "30 AI Content pieces", "Basic Analytics", "Email Support"],
  },
  {
    id: "growth", name: "Growth", price: 2999, usd: 54,
    features: ["3 Websites", "Unlimited SEO Audits", "200 Content pieces/mo", "Client CRM (20)", "Priority Support", "PDF Reports"],
  },
  {
    id: "pro", name: "Pro", price: 4999, usd: 90,
    features: ["Unlimited everything", "White-label Reports", "Unlimited Clients", "Dedicated Manager", "API Access", "5 Team Accounts"],
  },
]

const invoices = [
  { date: "Nov 1, 2024", amount: "₱2,999", plan: "Growth", status: "Paid", method: "GCash" },
  { date: "Oct 1, 2024", amount: "₱2,999", plan: "Growth", status: "Paid", method: "GCash" },
  { date: "Sep 1, 2024", amount: "₱2,999", plan: "Growth", status: "Paid", method: "GCash" },
  { date: "Aug 1, 2024", amount: "₱2,999", plan: "Growth", status: "Paid", method: "GCash" },
]

const usage = [
  { label: "SEO Audits", used: 23, max: 0, unlimited: true, color: "bg-blue-600" },
  { label: "AI Content Pieces", used: 142, max: 200, unlimited: false, color: "bg-purple-600" },
  { label: "Website Builders", used: 2, max: 3, unlimited: false, color: "bg-green-600" },
  { label: "Clients", used: 23, max: 20, unlimited: false, color: "bg-amber-600" },
]

export default function BillingPage() {
  const [upgradeTarget, setUpgradeTarget] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"gcash" | "maya" | "card">("gcash")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setSuccess(true)
    setTimeout(() => { setUpgradeTarget(null); setSuccess(false) }, 2000)
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your plan, payment methods, and invoices</p>
      </div>

      {/* Current Plan */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0 shadow-lg shadow-blue-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Badge className="bg-white/20 text-white border-white/30 mb-2">✓ Current Plan</Badge>
              <h2 className="text-2xl font-bold">Growth Plan</h2>
              <p className="text-blue-200 mt-1">₱2,999/month · Next billing: Dec 1, 2024</p>
              <p className="text-blue-300 text-sm mt-0.5">14 days left in free trial — no charge until Dec 1</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-amber-400">₱2,999</div>
              <p className="text-blue-200 text-sm">≈ $54 USD/month</p>
            </div>
          </div>
          <Separator className="bg-white/20 my-5" />
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {["3 Websites", "Unlimited SEO Audits", "200 AI Content/mo", "20 Clients", "Priority Support", "PDF Reports"].map((f) => (
              <div key={f} className="flex items-center gap-1.5 text-sm text-blue-100">
                <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">This Month's Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {usage.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">
                  {item.unlimited ? `${item.used} used · Unlimited` : `${item.used} / ${item.max}`}
                </span>
              </div>
              {!item.unlimited && (
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: `${Math.min(100, (item.used / item.max) * 100)}%` }}
                  />
                </div>
              )}
              {item.unlimited && (
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className={`${item.color} h-2 rounded-full w-full opacity-30`} />
                </div>
              )}
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            ⚠️ You've exceeded your 20-client limit. Upgrade to Pro for unlimited clients.
          </p>
        </CardContent>
      </Card>

      {/* Upgrade options */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Change Your Plan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isCurrent = plan.id === "growth"
            return (
              <Card key={plan.id} className={cn("transition-all", isCurrent ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-200" : "hover:shadow-md")}>
                <CardContent className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-base">{plan.name}</h3>
                      <div className="text-2xl font-black text-blue-600 mt-0.5">
                        ₱{plan.price.toLocaleString()}
                        <span className="text-sm text-muted-foreground font-normal">/mo</span>
                      </div>
                      <div className="text-xs text-muted-foreground">(${plan.usd} USD)</div>
                    </div>
                    {isCurrent && <Badge className="bg-blue-600 text-white border-0">Current</Badge>}
                  </div>
                  <ul className="space-y-1.5">
                    {plan.features.map((f) => (
                      <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-green-500 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  {!isCurrent && (
                    <Dialog open={upgradeTarget === plan.id} onOpenChange={(o) => { setUpgradeTarget(o ? plan.id : null); setSuccess(false) }}>
                      <DialogTrigger asChild>
                        <Button
                          className={cn("w-full", plan.id === "pro" ? "bg-blue-600 hover:bg-blue-700" : "")}
                          variant={plan.id === "pro" ? "default" : "outline"}
                          size="sm"
                        >
                          {plan.price > 2999 ? "⬆ Upgrade to Pro" : "⬇ Downgrade to Starter"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle>
                            {plan.price > 2999 ? "Upgrade to" : "Switch to"} {plan.name}
                          </DialogTitle>
                        </DialogHeader>
                        {!success ? (
                          <div className="space-y-4 py-1">
                            <p className="text-sm text-muted-foreground">
                              ₱{plan.price.toLocaleString()}/month, billed monthly. Choose payment:
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { id: "gcash" as const, label: "GCash", color: "bg-blue-600", emoji: "G" },
                                { id: "maya" as const, label: "Maya", color: "bg-green-600", emoji: "M" },
                                { id: "card" as const, label: "Card", color: "bg-gray-600", emoji: "💳" },
                              ].map((pm) => (
                                <button
                                  key={pm.id}
                                  onClick={() => setPaymentMethod(pm.id)}
                                  className={cn(
                                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                                    paymentMethod === pm.id ? "border-blue-500 bg-blue-50" : "border-border hover:border-blue-200"
                                  )}
                                >
                                  <div className={`w-9 h-9 ${pm.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                                    {pm.emoji}
                                  </div>
                                  <span className="text-xs font-medium">{pm.label}</span>
                                </button>
                              ))}
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleUpgrade} disabled={loading}>
                              {loading ? "Processing..." : `Confirm — ₱${plan.price.toLocaleString()}/mo via ${paymentMethod === "gcash" ? "GCash" : paymentMethod === "maya" ? "Maya" : "Card"}`}
                            </Button>
                          </div>
                        ) : (
                          <div className="py-8 flex flex-col items-center gap-3 text-center">
                            <CheckCircle className="w-14 h-14 text-green-500" />
                            <div>
                              <p className="font-bold text-lg">Plan updated! 🎉</p>
                              <p className="text-sm text-muted-foreground mt-1">You're now on the {plan.name} plan</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Payment methods */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">G</div>
              <div>
                <p className="text-sm font-semibold">GCash</p>
                <p className="text-xs text-muted-foreground">+63 9XX XXX X890 · Default method</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700 border-0">Active</Badge>
          </div>
          <Button variant="outline" className="gap-2 text-sm h-10 w-full sm:w-auto">
            <CreditCard className="w-4 h-4" />
            Add Payment Method (GCash, Maya, Card)
          </Button>
        </CardContent>
      </Card>

      {/* Billing history */}
      <Card className="border-border/60">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Billing History</CardTitle>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Download All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {invoices.map((inv, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{inv.plan} Plan</p>
                  <p className="text-xs text-muted-foreground">{inv.date} · {inv.method}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{inv.amount}</span>
                  <Badge className="bg-green-100 text-green-700 border-0 text-xs">{inv.status}</Badge>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Promo */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-900">Save 20% with Annual Billing</p>
              <p className="text-sm text-amber-700">Pay once a year and save ₱7,188 on the Growth plan</p>
            </div>
          </div>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white flex-shrink-0">
            Switch to Annual
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
