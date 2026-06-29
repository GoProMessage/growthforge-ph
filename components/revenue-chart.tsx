"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", revenue: 14970, clients: 5 },
  { month: "Feb", revenue: 20993, clients: 7 },
  { month: "Mar", revenue: 26988, clients: 9 },
  { month: "Apr", revenue: 32997, clients: 11 },
  { month: "May", revenue: 38994, clients: 13 },
  { month: "Jun", revenue: 41993, clients: 14 },
  { month: "Jul", revenue: 47990, clients: 16 },
  { month: "Aug", revenue: 50989, clients: 17 },
  { month: "Sep", revenue: 53988, clients: 18 },
  { month: "Oct", revenue: 48500, clients: 23 },
]

interface TooltipPayload {
  value: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-xl shadow-lg p-3 text-sm">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-green-600 font-bold">₱{payload[0].value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">≈ ${Math.round(payload[0].value / 56).toLocaleString()} USD</p>
      </div>
    )
  }
  return null
}

export function RevenueChart() {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-base font-semibold">Monthly Revenue (MRR)</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Philippine Pesos · Goal: ₱168,000/month</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-green-50 text-green-700 border-green-100">+224% YTD</Badge>
          <Badge variant="outline" className="text-xs">Oct 2024</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={230}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -5, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={2.5}
              fill="url(#revenueGrad)"
              dot={{ r: 3, fill: "#2563eb", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#2563eb" }}
            />
          </AreaChart>
        </ResponsiveContainer>
        {/* Goal line indicator */}
        <div className="flex items-center justify-between mt-3 px-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-3 h-0.5 bg-blue-500 rounded" />
            Current MRR
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-3 h-0.5 bg-amber-400 rounded border-dashed" />
            $3K Goal = ₱168,000
          </div>
          <div className="text-xs font-medium text-green-600">29% to goal</div>
        </div>
      </CardContent>
    </Card>
  )
}
