"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Users, DollarSign, Search, FileText, Globe,
  AlertCircle, Activity, RefreshCw, Filter
} from "lucide-react"

interface ActivityEvent {
  id: string
  type: "signup" | "payment" | "seo" | "content" | "website" | "upgrade" | "error"
  user: string
  detail: string
  city: string
  time: string
  amount?: number
}

const initialEvents: ActivityEvent[] = [
  { id: "1", type: "payment", user: "Donna Cruz", detail: "Maya payment received — Pro Plan renewal", city: "Paranaque", time: "2 min ago", amount: 4999 },
  { id: "2", type: "signup", user: "Mike Ocampo", detail: "New signup — Growth Plan free trial started", city: "Pampanga", time: "3 min ago" },
  { id: "3", type: "seo", user: "Roberto Lim", detail: "SEO Audit run on limsupply.ph — Score: 82/100", city: "Makati", time: "8 min ago" },
  { id: "4", type: "content", user: "Grace Tan", detail: "Generated: Blog Post (Filipino/English) — 'Health Tips 2026'", city: "Davao", time: "12 min ago" },
  { id: "5", type: "payment", user: "Maria Santos", detail: "GCash payment received — Growth Plan renewal", city: "Cebu City", time: "15 min ago", amount: 2999 },
  { id: "6", type: "website", user: "Ana Reyes", detail: "New website published — Reyes Law Office (Services template)", city: "BGC", time: "22 min ago" },
  { id: "7", type: "upgrade", user: "Carlo dela Cruz", detail: "Plan upgraded: Starter → Growth Plan", city: "Quezon City", time: "31 min ago", amount: 1500 },
  { id: "8", type: "content", user: "Roberto Lim", detail: "Generated: Ad Copy — Facebook Ad for limsupply.ph", city: "Makati", time: "35 min ago" },
  { id: "9", type: "seo", user: "Grace Tan", detail: "SEO Audit run on graceclinic.ph — Score: 91/100", city: "Davao", time: "41 min ago" },
  { id: "10", type: "signup", user: "Jun Villanueva", detail: "New signup — Starter Plan free trial started", city: "Manila", time: "48 min ago" },
  { id: "11", type: "error", user: "Tony Flores", detail: "Payment failed — Card declined (Growth Plan renewal)", city: "Batangas", time: "1 hr ago" },
  { id: "12", type: "content", user: "Maria Santos", detail: "Generated: Social Caption (Tagalog) — 3 variants", city: "Cebu City", time: "1 hr ago" },
  { id: "13", type: "payment", user: "Lea Gomez", detail: "GCash payment received — Starter Plan renewal", city: "Iloilo", time: "2 hr ago", amount: 1499 },
  { id: "14", type: "website", user: "Donna Cruz", detail: "Website template updated — DC Realty (Real Estate)", city: "Paranaque", time: "2 hr ago" },
  { id: "15", type: "seo", user: "Carlo dela Cruz", detail: "SEO Audit run on dctrading.ph — Score: 76/100", city: "Quezon City", time: "3 hr ago" },
  { id: "16", type: "content", user: "Ana Reyes", detail: "Generated: Email Campaign — Client outreach sequence", city: "BGC", time: "3 hr ago" },
  { id: "17", type: "upgrade", user: "Donna Cruz", detail: "Plan upgraded: Growth → Pro Plan", city: "Paranaque", time: "4 hr ago", amount: 2000 },
  { id: "18", type: "payment", user: "Roberto Lim", detail: "Maya payment received — Pro Plan renewal", city: "Makati", time: "5 hr ago", amount: 4999 },
  { id: "19", type: "signup", user: "Grace Tan", detail: "New account signup — Growth Plan (March 2026)", city: "Davao", time: "Mar 1, 2026" },
  { id: "20", type: "content", user: "Jun Villanueva", detail: "Generated: Product Description — IT Services packages", city: "Manila", time: "Today, 9:14 AM" },
]

const liveUpdates: ActivityEvent[] = [
  { id: "live1", type: "seo", user: "Maria Santos", detail: "SEO Audit run on santosbakery.ph — Score: 88/100", city: "Cebu City", time: "Just now" },
  { id: "live2", type: "payment", user: "Roberto Lim", detail: "Maya payment received — Pro Plan", city: "Makati", time: "Just now", amount: 4999 },
  { id: "live3", type: "content", user: "Mike Ocampo", detail: "Generated: Blog Post — '5 Food Business Tips'", city: "Pampanga", time: "Just now" },
  { id: "live4", type: "signup", user: "Petra Navarro", detail: "New signup — Growth Plan trial started", city: "Cebu City", time: "Just now" },
]

const typeConfig = {
  signup: { label: "Signup", icon: Users, bg: "bg-blue-100", text: "text-blue-600", dot: "bg-blue-500" },
  payment: { label: "Payment", icon: DollarSign, bg: "bg-green-100", text: "text-green-600", dot: "bg-green-500" },
  seo: { label: "SEO Audit", icon: Search, bg: "bg-purple-100", text: "text-purple-600", dot: "bg-purple-500" },
  content: { label: "Content", icon: FileText, bg: "bg-violet-100", text: "text-violet-600", dot: "bg-violet-500" },
  website: { label: "Website", icon: Globe, bg: "bg-cyan-100", text: "text-cyan-600", dot: "bg-cyan-500" },
  upgrade: { label: "Upgrade", icon: Activity, bg: "bg-amber-100", text: "text-amber-600", dot: "bg-amber-500" },
  error: { label: "Error", icon: AlertCircle, bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" },
}

const filters = [
  { id: "all", label: "All Events" },
  { id: "payment", label: "Payments" },
  { id: "signup", label: "Signups" },
  { id: "seo", label: "SEO Audits" },
  { id: "content", label: "Content" },
  { id: "error", label: "Errors" },
]

export default function AdminActivityPage() {
  const [events, setEvents] = useState(initialEvents)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [liveMode, setLiveMode] = useState(true)
  const [liveIndex, setLiveIndex] = useState(0)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (!liveMode) return
    const interval = setInterval(() => {
      const next = liveUpdates[liveIndex % liveUpdates.length]
      const newEvent = { ...next, id: `live-${Date.now()}`, time: "Just now" }
      setEvents(prev => [newEvent, ...prev.slice(0, 29)])
      setLiveIndex(i => i + 1)
      setPulse(true)
      setTimeout(() => setPulse(false), 800)
    }, 5000)
    return () => clearInterval(interval)
  }, [liveMode, liveIndex])

  const filtered = events.filter(e => {
    const matchFilter = filter === "all" || e.type === filter
    const matchSearch = search === "" ||
      e.user.toLowerCase().includes(search.toLowerCase()) ||
      e.detail.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const counts = {
    total: events.length,
    payments: events.filter(e => e.type === "payment").length,
    signups: events.filter(e => e.type === "signup").length,
    errors: events.filter(e => e.type === "error").length,
    todayRevenue: events
      .filter(e => e.type === "payment" && (e.time.includes("min") || e.time.includes("hr") || e.time === "Just now"))
      .reduce((s, e) => s + (e.amount || 0), 0),
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-violet-600" />
            <h1 className="text-2xl font-bold text-gray-900">Live Activity Feed</h1>
            {liveMode && (
              <Badge className="bg-green-500 text-white border-0 gap-1.5 flex items-center">
                <span className={`w-1.5 h-1.5 rounded-full bg-white ${pulse ? "opacity-100" : "opacity-70"} transition-opacity`} />
                LIVE
              </Badge>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1">Every user action across the platform — real-time</p>
        </div>
        <Button
          variant={liveMode ? "default" : "outline"}
          size="sm"
          onClick={() => setLiveMode(l => !l)}
          className={`gap-2 ${liveMode ? "bg-violet-600 hover:bg-violet-700 text-white" : ""}`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${liveMode ? "animate-spin" : ""}`} />
          {liveMode ? "Live" : "Paused"}
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Events Today", value: counts.total, icon: Activity, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Payments", value: counts.payments, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
          { label: "New Signups", value: counts.signups, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Today Revenue", value: `₱${counts.todayRevenue.toLocaleString()}`, icon: Activity, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div>
                <p className="text-lg font-black text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters + Search */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {filters.map(f => (
                <Button
                  key={f.id}
                  variant={filter === f.id ? "default" : "ghost"}
                  size="sm"
                  className={`text-xs h-7 ${filter === f.id ? "bg-violet-600 text-white hover:bg-violet-700" : "text-gray-600"}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </Button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <Input
                placeholder="Search events..."
                className="pl-8 h-8 text-xs w-48"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Filter className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No events match your filter</p>
            </div>
          ) : (
            filtered.map((event) => {
              const cfg = typeConfig[event.type]
              return (
                <div key={event.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/80 transition-colors">
                  {/* Icon */}
                  <div className={`w-9 h-9 ${cfg.bg} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <cfg.icon className={`w-4 h-4 ${cfg.text}`} />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">{event.user}</span>
                      <Badge className={`${cfg.bg} ${cfg.text} border-0 text-[10px] h-4 px-1.5`}>{cfg.label}</Badge>
                      {event.city && <span className="text-xs text-gray-400">📍 {event.city}</span>}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{event.detail}</p>
                  </div>
                  {/* Right */}
                  <div className="flex-shrink-0 text-right">
                    {event.amount && (
                      <p className="text-sm font-bold text-green-600">+₱{event.amount.toLocaleString()}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">{event.time}</p>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
