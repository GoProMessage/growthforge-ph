"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const monthlyData = [
  { month: "Jan", revenue: 14970, clients: 5, content: 45 },
  { month: "Feb", revenue: 20993, clients: 7, content: 68 },
  { month: "Mar", revenue: 26988, clients: 9, content: 82 },
  { month: "Apr", revenue: 32997, clients: 11, content: 94 },
  { month: "May", revenue: 38994, clients: 13, content: 110 },
  { month: "Jun", revenue: 41993, clients: 14, content: 118 },
  { month: "Jul", revenue: 47990, clients: 16, content: 125 },
  { month: "Aug", revenue: 50989, clients: 17, content: 130 },
  { month: "Sep", revenue: 53988, clients: 18, content: 138 },
  { month: "Oct", revenue: 48500, clients: 23, content: 142 },
]

const planBreakdown = [
  { name: "Growth", value: 17, color: "#2563eb" },
  { name: "Pro", value: 4, color: "#7c3aed" },
  { name: "Starter", value: 2, color: "#94a3b8" },
]

const topTools = [
  { tool: "SEO Audit", uses: 187, growth: "+24%" },
  { tool: "AI Content", uses: 142, growth: "+31%" },
  { tool: "Website Builder", uses: 45, growth: "+12%" },
  { tool: "Client Reports", uses: 89, growth: "+18%" },
]

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Business Analytics</h1>
          <p className="text-muted-foreground">Real-time insights into your revenue and tool usage</p>
        </div>
        <Badge className="bg-green-100 text-green-700 border-green-200 text-sm">+224% YTD Growth</Badge>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "MRR", value: "₱48,500", sub: "≈ $866 USD", color: "text-green-700" },
          { label: "ARR (projected)", value: "₱582K", sub: "≈ $10,393 USD", color: "text-blue-700" },
          { label: "Churn Rate", value: "2.1%", sub: "Industry avg: 5%", color: "text-purple-700" },
          { label: "LTV per Client", value: "₱47,984", sub: "Avg 16 mo retention", color: "text-amber-700" },
        ].map((m) => (
          <Card key={m.label} className="border-border/60">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className={`text-2xl font-bold mt-1 ${m.color}`}>{m.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue + Client charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue Growth (MRR)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₱${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => `₱${v.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Client Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="clients" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Plan breakdown + Tool usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Clients by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={planBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {planBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {planBreakdown.map((p) => (
                  <div key={p.name} className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                    <div>
                      <p className="text-sm font-medium">{p.name} — {p.value} clients</p>
                      <p className="text-xs text-muted-foreground">₱{(p.value * (p.name === "Growth" ? 2999 : p.name === "Pro" ? 4999 : 1499)).toLocaleString()}/mo</p>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-1 border-t">23 total active clients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Tools This Month</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topTools.map((t) => (
              <div key={t.tool} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{t.tool}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{t.uses} uses</span>
                      <span className="text-green-600 text-xs font-medium">{t.growth}</span>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(t.uses / 200) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
