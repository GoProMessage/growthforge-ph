"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts"
import { DollarSign, TrendingUp, TrendingDown, CreditCard, AlertCircle } from "lucide-react"

const monthlyData = [
  { month: "Jan", mrr: 84500, new: 28400, churned: 4200 },
  { month: "Feb", mrr: 112000, new: 31500, churned: 4000 },
  { month: "Mar", mrr: 134800, new: 27800, churned: 5000 },
  { month: "Apr", mrr: 158200, new: 28400, churned: 5000 },
  { month: "May", mrr: 198600, new: 45200, churned: 4800 },
  { month: "Jun", mrr: 245421, new: 52000, churned: 5179 },
]

const planRevenue = [
  { name: "Starter", value: 34477, color: "#c084fc", users: 23, price: 1499 },
  { name: "Growth", value: 143952, color: "#7c3aed", users: 48, price: 2999 },
  { name: "Pro", value: 89982, color: "#a855f7", users: 18, price: 4999 },
]

const methodData = [
  { method: "GCash", amount: 112994, pct: 46, transactions: 72, color: "#3b82f6" },
  { method: "Maya", amount: 85898, pct: 35, transactions: 55, color: "#8b5cf6" },
  { method: "Card", amount: 46529, pct: 19, transactions: 29, color: "#6b7280" },
]

const renewals = [
  { name: "Roberto Lim", plan: "Pro", amount: 4999, date: "Jun 28", method: "Maya" },
  { name: "Maria Santos", plan: "Growth", amount: 2999, date: "Jun 29", method: "GCash" },
  { name: "Ana Reyes", plan: "Pro", amount: 4999, date: "Jul 1", method: "Card" },
  { name: "Carlo dela Cruz", plan: "Growth", amount: 2999, date: "Jul 2", method: "GCash" },
  { name: "Grace Tan", plan: "Growth", amount: 2999, date: "Jul 3", method: "GCash" },
  { name: "Donna Cruz", plan: "Pro", amount: 4999, date: "Jul 4", method: "Maya" },
]

const transactions = [
  { user: "Donna Cruz", plan: "Pro", amount: 4999, method: "Maya", date: "Jun 26", status: "success" },
  { user: "Maria Santos", plan: "Growth", amount: 2999, method: "GCash", date: "Jun 26", status: "success" },
  { user: "Grace Tan", plan: "Growth", amount: 2999, method: "GCash", date: "Jun 25", status: "success" },
  { user: "Roberto Lim", plan: "Pro", amount: 4999, method: "Maya", date: "Jun 25", status: "success" },
  { user: "Lea Gomez", plan: "Starter", amount: 1499, method: "GCash", date: "Jun 24", status: "success" },
  { user: "Tony Flores", plan: "Growth", amount: 2999, method: "Card", date: "Jun 20", status: "failed" },
]

export default function AdminRevenuePage() {
  const [period, setPeriod] = useState("monthly")

  const mrr = 245421
  const prevMrr = 198600
  const mrrGrowth = (((mrr - prevMrr) / prevMrr) * 100).toFixed(1)
  const arr = mrr * 12
  const ltv = (mrr / 89) * (1 / 0.021) // avg MRR / user / churn rate
  const churnRevenue = 5179

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-violet-600" />
            <h1 className="text-2xl font-bold text-gray-900">Revenue Analytics</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">Full financial picture — MRR, ARR, churn & payment breakdown</p>
        </div>
        <div className="flex gap-2">
          {["monthly", "quarterly", "annual"].map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "ghost"}
              size="sm"
              className={`capitalize text-xs h-8 ${period === p ? "bg-violet-600 text-white hover:bg-violet-700" : ""}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "MRR", value: `₱${mrr.toLocaleString()}`, sub: `≈ $${(mrr / 56).toFixed(0)} USD`,
            icon: DollarSign, color: "text-violet-600", bg: "bg-violet-50",
            trend: `+${mrrGrowth}%`, up: true
          },
          {
            label: "ARR", value: `₱${(arr / 1000000).toFixed(2)}M`, sub: `≈ $${(arr / 56 / 1000).toFixed(0)}K USD`,
            icon: TrendingUp, color: "text-green-600", bg: "bg-green-50",
            trend: "Annualized", up: true
          },
          {
            label: "Avg LTV", value: `₱${Math.round(ltv).toLocaleString()}`, sub: "Per paying user",
            icon: CreditCard, color: "text-blue-600", bg: "bg-blue-50",
            trend: "At 2.1% churn", up: true
          },
          {
            label: "Churned MRR", value: `₱${churnRevenue.toLocaleString()}`, sub: "This month",
            icon: TrendingDown, color: "text-red-500", bg: "bg-red-50",
            trend: "2.1% churn rate", up: false
          },
        ].map((k) => (
          <Card key={k.label} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${k.bg} rounded-xl flex items-center justify-center`}>
                  <k.icon className={`w-5 h-5 ${k.color}`} />
                </div>
                <Badge className={`border-0 text-xs ${k.up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {k.trend}
                </Badge>
              </div>
              <p className="text-2xl font-black text-gray-900">{k.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{k.label}</p>
              <p className="text-xs text-gray-400">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MRR Trend */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center justify-between">
            <span>MRR Trend — New vs Churned</span>
            <Badge className="bg-green-100 text-green-700 border-0">+190% YTD</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="mrrG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="newG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number, n: string) => [`₱${v.toLocaleString()}`, n === "mrr" ? "Total MRR" : n === "new" ? "New MRR" : "Churned"]} />
              <Legend />
              <Area type="monotone" dataKey="mrr" name="mrr" stroke="#7c3aed" strokeWidth={2.5} fill="url(#mrrG)" />
              <Area type="monotone" dataKey="new" name="new" stroke="#22c55e" strokeWidth={2} fill="url(#newG)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Plan Revenue + Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Revenue by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={planRevenue} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={4}>
                    {planRevenue.map((p) => <Cell key={p.name} fill={p.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {planRevenue.map((p) => (
                  <div key={p.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-sm font-medium text-gray-700">{p.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">₱{p.value.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-400 ml-4">{p.users} users × ₱{p.price}/mo</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Payment Method Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={methodData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="method" tick={{ fontSize: 12 }} width={50} />
                <Tooltip formatter={(v: number) => [`₱${v.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                  {methodData.map((d) => <Cell key={d.method} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {methodData.map((m) => (
                <div key={m.method} className="text-center bg-gray-50 rounded-lg p-2">
                  <p className="text-sm font-bold" style={{ color: m.color }}>{m.pct}%</p>
                  <p className="text-xs text-gray-500">{m.method}</p>
                  <p className="text-[10px] text-gray-400">{m.transactions} users</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Renewals + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Upcoming Renewals (Next 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {renewals.map((r) => (
              <div key={r.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.date} · {r.method}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">₱{r.amount.toLocaleString()}</p>
                  <Badge className={`text-[10px] border-0 ${r.plan === "Pro" ? "bg-amber-100 text-amber-700" : "bg-violet-100 text-violet-700"}`}>{r.plan}</Badge>
                </div>
              </div>
            ))}
            <div className="bg-violet-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-violet-700">Total Expected: ₱{renewals.reduce((s, r) => s + r.amount, 0).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactions.map((t, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${t.status === "success" ? "bg-green-500" : "bg-red-500"}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.user}</p>
                    <p className="text-xs text-gray-400">{t.date} · {t.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${t.status === "success" ? "text-green-600" : "text-red-500"}`}>
                    {t.status === "success" ? "+" : "✗ "}₱{t.amount.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-400 capitalize">{t.status}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
