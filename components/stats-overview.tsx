"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, FileText, Search, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Monthly Revenue (MRR)",
    value: "₱48,500",
    change: "+12.5% vs last month",
    trend: "up",
    sub: "≈ $866 USD / Target: ₱168,000",
    icon: DollarSign,
    iconStyle: "text-green-600 bg-green-50",
  },
  {
    title: "Active Clients",
    value: "23",
    change: "+3 new this month",
    trend: "up",
    sub: "Need 33 more for $3K goal",
    icon: Users,
    iconStyle: "text-blue-600 bg-blue-50",
  },
  {
    title: "Content Generated",
    value: "142",
    change: "+28 pieces this week",
    trend: "up",
    sub: "Blogs, captions & ad copy",
    icon: FileText,
    iconStyle: "text-purple-600 bg-purple-50",
  },
  {
    title: "SEO Score (Avg)",
    value: "87/100",
    change: "+5 pts from last month",
    trend: "up",
    sub: "Across 23 client sites",
    icon: Search,
    iconStyle: "text-amber-600 bg-amber-50",
  },
]

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border/60 hover:shadow-sm transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm text-muted-foreground leading-tight max-w-[140px]">{stat.title}</p>
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", stat.iconStyle)}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1.5">{stat.value}</div>
            <div className="flex items-center gap-1 mb-1">
              {stat.trend === "up"
                ? <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                : <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              }
              <span className={cn("text-xs font-medium", stat.trend === "up" ? "text-green-600" : "text-red-600")}>
                {stat.change}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{stat.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
