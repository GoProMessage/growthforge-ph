"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Settings, DollarSign, Zap, CreditCard, CheckCircle,
  AlertCircle, Shield, Globe, Bell
} from "lucide-react"

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
}

const initialPlans: Plan[] = [
  { id: "starter", name: "Starter", price: 1499, features: ["5 SEO Audits/month", "50 AI Content pieces", "1 Website", "Basic Analytics"] },
  { id: "growth", name: "Growth", price: 2999, features: ["25 SEO Audits/month", "200 AI Content pieces", "3 Websites", "Advanced Analytics", "Priority Support"] },
  { id: "pro", name: "Pro", price: 4999, features: ["Unlimited SEO Audits", "Unlimited AI Content", "10 Websites", "Custom Analytics", "24/7 Support", "White-label"] },
]

interface Feature {
  id: string
  name: string
  description: string
  enabled: boolean
  plans: string[]
}

const initialFeatures: Feature[] = [
  { id: "seo", name: "SEO Audit Tool", description: "Full website SEO analysis with recommendations", enabled: true, plans: ["Starter", "Growth", "Pro"] },
  { id: "content", name: "AI Content Generator", description: "Filipino/English multilingual content generation", enabled: true, plans: ["Starter", "Growth", "Pro"] },
  { id: "website", name: "Website Builder", description: "Drag-and-drop website builder with templates", enabled: true, plans: ["Starter", "Growth", "Pro"] },
  { id: "analytics", name: "Advanced Analytics", description: "Deep business intelligence dashboard", enabled: true, plans: ["Growth", "Pro"] },
  { id: "whitelabel", name: "White-label Reports", description: "Branded reports for client presentations", enabled: false, plans: ["Pro"] },
  { id: "api", name: "API Access", description: "REST API for custom integrations", enabled: false, plans: ["Pro"] },
  { id: "trial", name: "Free Trial (14 days)", description: "Allow new users to try before paying", enabled: true, plans: ["All"] },
  { id: "annual", name: "Annual Discount (20%)", description: "Offer 20% off for yearly subscriptions", enabled: true, plans: ["All"] },
]

const gateways = [
  { id: "gcash", name: "GCash", logo: "💙", fee: "1.5% + ₱15", volume: "₱112,994", txns: 72 },
  { id: "maya", name: "Maya (PayMaya)", logo: "💚", fee: "1.8% + ₱15", volume: "₱85,898", txns: 55 },
  { id: "card", name: "Credit / Debit Card", logo: "💳", fee: "2.5% + ₱25", volume: "₱46,529", txns: 29 },
]

export default function AdminSettingsPage() {
  const [plans, setPlans] = useState(initialPlans)
  const [features, setFeatures] = useState(initialFeatures)
  const [saved, setSaved] = useState(false)
  const [announcement, setAnnouncement] = useState("")
  const [showBanner, setShowBanner] = useState(false)
  const [editingPlan, setEditingPlan] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState("")

  const saveSettings = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const startEditPrice = (plan: Plan) => {
    setEditingPlan(plan.id)
    setEditPrice(plan.price.toString())
  }

  const savePrice = (planId: string) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, price: parseInt(editPrice) || p.price } : p))
    setEditingPlan(null)
  }

  const toggleFeature = (id: string) => {
    setFeatures(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))
  }

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-violet-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Platform Settings</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">Manage pricing, features, integrations & platform config</p>
        </div>
        <Button
          onClick={saveSettings}
          className={`gap-2 w-full sm:w-auto ${saved ? "bg-green-600 hover:bg-green-700" : "bg-violet-600 hover:bg-violet-700"} text-white`}
        >
          {saved ? <><CheckCircle className="w-4 h-4" />Saved!</> : <><Shield className="w-4 h-4" />Save Changes</>}
        </Button>
      </div>

      {saved && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700 font-medium">Settings saved successfully. Changes are live.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="plans">
        {/* Tabs — scrollable on narrow screens */}
        <div className="overflow-x-auto">
          <TabsList className="grid grid-cols-4 min-w-[360px] h-11">
            <TabsTrigger value="plans" className="gap-1.5 text-xs sm:text-sm"><DollarSign className="w-3.5 h-3.5" />Plans</TabsTrigger>
            <TabsTrigger value="features" className="gap-1.5 text-xs sm:text-sm"><Zap className="w-3.5 h-3.5" />Features</TabsTrigger>
            <TabsTrigger value="payments" className="gap-1.5 text-xs sm:text-sm"><CreditCard className="w-3.5 h-3.5" />Payments</TabsTrigger>
            <TabsTrigger value="platform" className="gap-1.5 text-xs sm:text-sm"><Globe className="w-3.5 h-3.5" />Platform</TabsTrigger>
          </TabsList>
        </div>

        {/* Plans & Pricing */}
        <TabsContent value="plans" className="mt-4">
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Edit subscription pricing. Changes apply to new subscribers immediately.</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <Card key={plan.id} className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold text-gray-900">{plan.name}</CardTitle>
                      <Badge className={plan.id === "pro" ? "bg-amber-100 text-amber-700 border-0" : plan.id === "growth" ? "bg-violet-100 text-violet-700 border-0" : "bg-gray-100 text-gray-600 border-0"}>
                        {plan.id === "growth" ? "Popular" : plan.id === "pro" ? "Top" : "Entry"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-2">Monthly Price (PHP)</p>
                      {editingPlan === plan.id ? (
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₱</span>
                            <Input className="pl-7 h-9" value={editPrice} onChange={e => setEditPrice(e.target.value)} type="number" />
                          </div>
                          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white h-9" onClick={() => savePrice(plan.id)}>Save</Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-black text-gray-900">₱{plan.price.toLocaleString()}</span>
                          <Button variant="ghost" size="sm" className="text-xs text-violet-600 h-7" onClick={() => startEditPrice(plan)}>Edit</Button>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-1">≈ ${(plan.price / 56).toFixed(0)} USD/month</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500">INCLUDED FEATURES</p>
                      {plan.features.map(f => (
                        <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Feature Flags */}
        <TabsContent value="features" className="mt-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Feature Toggles</CardTitle>
              <p className="text-sm text-gray-500">Enable or disable platform features for all users.</p>
            </CardHeader>
            <CardContent className="divide-y divide-gray-50">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-center justify-between py-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{feature.name}</p>
                      {feature.plans.slice(0, 2).map(p => (
                        <Badge key={p} className="text-[10px] h-4 px-1.5 border-0 bg-gray-100 text-gray-500">{p}</Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
                  </div>
                  <Switch checked={feature.enabled} onCheckedChange={() => toggleFeature(feature.id)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Gateways */}
        <TabsContent value="payments" className="mt-4">
          <div className="space-y-4">
            {gateways.map((gw) => (
              <Card key={gw.id} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex items-center gap-3 sm:block">
                      <div className="text-3xl">{gw.logo}</div>
                      <div className="sm:hidden">
                        <h3 className="font-bold text-gray-900">{gw.name}</h3>
                        <Badge className="bg-green-100 text-green-700 border-0 text-xs mt-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 inline-block animate-pulse" />
                          Active
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="hidden sm:flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900">{gw.name}</h3>
                        <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 inline-block animate-pulse" />
                          Active
                        </Badge>
                      </div>
                      {/* Stats — 1 col on mobile, 3 col on sm+ */}
                      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-gray-400">Transaction Fee</p>
                          <p className="text-sm font-semibold text-gray-900">{gw.fee}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Monthly Volume</p>
                          <p className="text-sm font-semibold text-green-600">{gw.volume}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Transactions</p>
                          <p className="text-sm font-semibold text-gray-900">{gw.txns}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex sm:flex-col gap-2">
                      <Button variant="outline" size="sm" className="text-xs flex-1 sm:flex-none">Configure</Button>
                      <Button variant="ghost" size="sm" className="text-xs text-red-500 hover:text-red-600 flex-1 sm:flex-none">Disable</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700 text-sm">
                Philippine payment regulations require all gateway transactions to be logged. Logs are retained for 7 years.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>

        {/* Platform Config */}
        <TabsContent value="platform" className="mt-4">
          <div className="space-y-4">
            {/* Announcement Banner */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Bell className="w-4 h-4 text-violet-500" />
                    Platform Announcement
                  </CardTitle>
                  <Switch checked={showBanner} onCheckedChange={setShowBanner} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="e.g., 🎉 New feature: Analytics v2 is live! Check it out in your dashboard."
                  className="text-sm resize-none"
                  rows={3}
                  value={announcement}
                  onChange={e => setAnnouncement(e.target.value)}
                />
                {showBanner && announcement && (
                  <div className="bg-violet-600 text-white rounded-xl px-4 py-3 text-sm font-medium">
                    📢 {announcement}
                  </div>
                )}
                <p className="text-xs text-gray-400">
                  {showBanner ? "Banner is visible to all logged-in users." : "Banner is currently hidden."}
                </p>
              </CardContent>
            </Card>

            {/* General Config */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">General Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* grid-cols-1 on mobile, 2 on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Platform Name</label>
                    <Input defaultValue="NegosyoAI" className="text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Support Email</label>
                    <Input defaultValue="support@negosyoai.ph" className="text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Trial Duration (days)</label>
                    <Input defaultValue="14" type="number" className="text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Default Currency</label>
                    <Input defaultValue="PHP (₱)" className="text-sm" />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  {[
                    { label: "Maintenance Mode", desc: "Take platform offline for updates", default: false },
                    { label: "New User Registration", desc: "Allow new signups on the platform", default: true },
                    { label: "Email Notifications", desc: "Send automated emails to users", default: true },
                    { label: "Usage Analytics Tracking", desc: "Track detailed tool usage for insights", default: true },
                  ].map((toggle) => (
                    <div key={toggle.label} className="flex items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{toggle.label}</p>
                        <p className="text-xs text-gray-500">{toggle.desc}</p>
                      </div>
                      <Switch defaultChecked={toggle.default} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Clear All Cache", desc: "Force refresh all cached pages and API responses" },
                  { label: "Reset Tool Usage Counters", desc: "Reset monthly usage for all users (use with caution)" },
                  { label: "Export All User Data", desc: "Download full platform data as CSV for backup" },
                ].map((action) => (
                  <div key={action.label} className="flex flex-col sm:flex-row sm:items-center gap-3 py-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{action.label}</p>
                      <p className="text-xs text-gray-500">{action.desc}</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-full sm:w-auto">
                      Run
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
