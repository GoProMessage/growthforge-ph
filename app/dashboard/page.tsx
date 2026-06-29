"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatsOverview } from "@/components/stats-overview"
import { RevenueChart } from "@/components/revenue-chart"
import { Search, FileText, Globe, Users, ArrowRight, Bell, Zap, TrendingUp } from "lucide-react"

const quickActions = [
  { href: "/dashboard/seo-audit", icon: Search, label: "Run SEO Audit", desc: "Analyze any website instantly", color: "bg-blue-50 hover:bg-blue-100 border-blue-100", iconColor: "text-blue-600 bg-blue-100", badge: "Popular" },
  { href: "/dashboard/content", icon: FileText, label: "Generate Content", desc: "AI blogs, captions, ad copy", color: "bg-purple-50 hover:bg-purple-100 border-purple-100", iconColor: "text-purple-600 bg-purple-100", badge: null },
  { href: "/dashboard/website", icon: Globe, label: "Website Builder", desc: "Build or edit a site", color: "bg-green-50 hover:bg-green-100 border-green-100", iconColor: "text-green-600 bg-green-100", badge: null },
  { href: "/dashboard/clients", icon: Users, label: "Manage Clients", desc: "View & manage all clients", color: "bg-amber-50 hover:bg-amber-100 border-amber-100", iconColor: "text-amber-600 bg-amber-100", badge: null },
]

const recentActivity = [
  { action: "SEO Audit completed", detail: "santos-bakery.ph — Score: 87/100 ✓", time: "2 min ago", dot: "bg-blue-500" },
  { action: "Content generated", detail: "5 social media captions for RealestatePH", time: "1 hr ago", dot: "bg-purple-500" },
  { action: "New client subscribed", detail: "JC Digital Agency — Growth Plan ₱2,999/mo", time: "3 hrs ago", dot: "bg-green-500" },
  { action: "Payment received", detail: "₱2,999 from Maria Santos via GCash", time: "Yesterday", dot: "bg-amber-500" },
  { action: "SEO Audit completed", detail: "realestateph.com — Score: 74/100", time: "Yesterday", dot: "bg-blue-500" },
]

const GOAL = 168000
const CURRENT_MRR = 48500
const progress = Math.round((CURRENT_MRR / GOAL) * 100)
const moreClientsNeeded = Math.ceil((GOAL - CURRENT_MRR) / 2999)

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header — wraps on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Good morning, Juan! 👋</h1>
          <p className="text-muted-foreground text-sm">Here's your business overview. You're on the right track!</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="icon" className="relative h-9 w-9">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">3</span>
          </Button>
          <Link href="/dashboard/billing">
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2 shadow-md shadow-blue-200 text-sm">
              <Zap className="w-4 h-4" />
              <span className="hidden xs:inline">Upgrade to Pro</span>
              <span className="xs:hidden">Upgrade</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* $3K Goal Progress Banner */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0 shadow-lg shadow-blue-200">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <p className="text-blue-100 text-sm font-medium">$3,000 USD / Month Goal</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold">₱{CURRENT_MRR.toLocaleString()} <span className="text-blue-300 text-base font-normal">/ ₱{GOAL.toLocaleString()}</span></p>
              <p className="text-blue-200 text-sm">Need <strong className="text-white">{moreClientsNeeded} more Growth clients</strong> to hit your goal</p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-4xl sm:text-5xl font-black text-amber-400">{progress}%</div>
              <p className="text-blue-200 text-sm">of ₱168K goal</p>
            </div>
          </div>
          <div className="mt-4 bg-blue-900/50 rounded-full h-2.5 overflow-hidden">
            <div className="bg-amber-400 h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <StatsOverview />

      {/* Revenue Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider px-1">Quick Actions</h2>
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${action.color}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${action.iconColor}`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm flex items-center gap-2 flex-wrap">
                    {action.label}
                    {action.badge && (
                      <Badge className="bg-amber-500 text-white border-0 text-[10px] h-4 px-1.5">{action.badge}</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{action.desc}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="border-border/60">
        <div className="p-5 pb-3 border-b">
          <h2 className="font-semibold">Recent Activity</h2>
        </div>
        <div className="p-4 space-y-3">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-start sm:items-center gap-3 py-1">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 sm:mt-0 ${item.dot}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.action}</p>
                <p className="text-xs text-muted-foreground truncate">{item.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
