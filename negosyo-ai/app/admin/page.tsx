"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import {
  Zap, Users, DollarSign, FileSearch, TrendingUp,
  Shield, Search, Mail, Phone, Calendar, CreditCard,
  CheckCircle, Clock, AlertCircle,
} from "lucide-react"

const ADMIN_KEY = "negosyo2024"

const MONTHLY_LEADS = [
  { month: "Jan", leads: 12, audits: 8 },
  { month: "Feb", leads: 18, audits: 14 },
  { month: "Mar", leads: 25, audits: 20 },
  { month: "Apr", leads: 32, audits: 27 },
  { month: "May", leads: 28, audits: 23 },
  { month: "Jun", leads: 41, audits: 35 },
]

const MONTHLY_REVENUE = [
  { month: "Jan", revenue: 44850 },
  { month: "Feb", revenue: 53820 },
  { month: "Mar", revenue: 74730 },
  { month: "Apr", revenue: 95760 },
  { month: "May", revenue: 83820 },
  { month: "Jun", revenue: 122730 },
]

const STATUS_BADGE: Record<string, string> = {
  new:        "bg-blue-500/20 text-blue-300 border-blue-500/30",
  contacted:  "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  converted:  "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  inactive:   "bg-slate-500/20 text-slate-400 border-slate-500/30",
}

const PLAN_BADGE: Record<string, string> = {
  Starter: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  Growth:  "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Pro:     "bg-amber-500/20 text-amber-300 border-amber-500/30",
}

// ── AdminGate ──────────────────────────────────────────────────────────────
function AdminGate({ onAuth }: { onAuth: () => void }) {
  const [key, setKey] = useState("")
  const [error, setError] = useState(false)

  const attempt = () => {
    if (key === ADMIN_KEY) { onAuth() }
    else { setError(true); setTimeout(() => setError(false), 1500) }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-10 w-full max-w-sm text-center space-y-6"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 mx-auto">
          <Zap className="h-8 w-8 text-blue-400" />
        </div>
        <div>
          <h1 className="text-white font-bold text-xl">NegosyoAI Admin</h1>
          <p className="text-slate-500 text-sm mt-1">Leads · Audits · Revenue</p>
        </div>
        <div className="space-y-3">
          <Input
            type="password"
            placeholder="Enter admin key"
            value={key}
            onChange={e => setKey(e.target.value)}
            onKeyDown={e => e.key === "Enter" && attempt()}
            className={`bg-slate-800 border-slate-700 text-white placeholder-slate-500 ${error ? "border-red-500" : ""}`}
          />
          {error && <p className="text-red-400 text-xs">Incorrect key</p>}
          <Button onClick={attempt} className="w-full bg-blue-600 hover:bg-blue-500">
            <Shield className="h-4 w-4 mr-2" /> Access Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
function AdminDashboard() {
  const [search, setSearch] = useState("")
  const [leads, setLeads] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [audits, setAudits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/leads").then(r => r.json()).catch(() => []),
      fetch("/api/payments").then(r => r.json()).catch(() => []),
      fetch("/api/audit").then(r => r.json()).catch(() => []),
    ]).then(([l, p, a]) => {
      setLeads(Array.isArray(l) ? l : [])
      setPayments(Array.isArray(p) ? p : [])
      setAudits(Array.isArray(a) ? a : [])
      setLoading(false)
    })
  }, [])

  const totalRevenue = payments.reduce((s: number, p: any) => s + (p.amount || 0), 0)
  const filteredLeads = leads.filter((l: any) =>
    search === "" ||
    (l.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (l.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (l.business || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/60 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">NegosyoAI Admin</h1>
              <p className="text-slate-500 text-xs">Philippines Growth Platform · Owner Access</p>
            </div>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Leads",    value: loading ? "—" : leads.length,                  icon: Users,       color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
            { label: "Audit Requests", value: loading ? "—" : audits.length,                 icon: FileSearch,  color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" },
            { label: "Payments",       value: loading ? "—" : payments.length,               icon: CreditCard,  color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
            { label: "Revenue (PHP)",  value: loading ? "—" : `₱${totalRevenue.toLocaleString()}`, icon: DollarSign,  color: "text-purple-400",  bg: "bg-purple-500/10 border-purple-500/20" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border p-5 ${bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-xs font-medium">{label}</p>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-400" /> Leads & Audits (6 months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={MONTHLY_LEADS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="leads" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Leads" />
                  <Bar dataKey="audits" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Audits" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-400" /> Monthly Revenue (PHP)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={MONTHLY_REVENUE}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={v => `₱${(v / 1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }}
                    formatter={(v: any) => [`₱${Number(v).toLocaleString()}`, "Revenue"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Data Tabs */}
        <Tabs defaultValue="leads">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="leads"   className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 text-xs">
              Leads <Badge className="ml-1.5 bg-blue-500/20 text-blue-300 text-[10px] px-1.5">{leads.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 text-xs">
              Payments <Badge className="ml-1.5 bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5">{payments.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="audits"  className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 text-xs">
              Audits <Badge className="ml-1.5 bg-amber-500/20 text-amber-300 text-[10px] px-1.5">{audits.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Leads Tab */}
          <TabsContent value="leads" className="mt-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-sm">Contact Form Leads</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                    <Input
                      placeholder="Search leads..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="pl-8 h-8 text-xs bg-slate-800 border-slate-700 text-white placeholder-slate-500 w-52"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-slate-500 text-sm text-center py-8">Loading leads…</div>
                ) : filteredLeads.length === 0 ? (
                  <div className="text-slate-500 text-sm text-center py-8">
                    {leads.length === 0 ? "No leads yet. They'll appear here once contacts submit the form." : "No results for your search."}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 hover:bg-transparent">
                        {["Name / Business", "Contact", "Service", "Status", "Date"].map(h => (
                          <TableHead key={h} className="text-slate-500 text-xs font-medium">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.map((lead: any, i: number) => (
                        <TableRow key={lead.id ?? i} className="border-slate-800 hover:bg-slate-800/40">
                          <TableCell>
                            <p className="text-white text-sm font-medium">{lead.name}</p>
                            <p className="text-slate-500 text-xs">{lead.business}</p>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-0.5">
                              <p className="text-slate-300 text-xs flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</p>
                              {lead.phone && <p className="text-slate-400 text-xs flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</p>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-slate-400 text-xs">{lead.service || "—"}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-[10px] px-2 ${STATUS_BADGE[lead.status] ?? STATUS_BADGE.new}`}>
                              {lead.status ?? "new"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-slate-500 text-xs">
                              {lead.created_at ? new Date(lead.created_at).toLocaleDateString("en-PH") : "—"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="mt-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">GCash / Maya Payments</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-slate-500 text-sm text-center py-8">Loading payments…</div>
                ) : payments.length === 0 ? (
                  <div className="text-slate-500 text-sm text-center py-8">No payments yet.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 hover:bg-transparent">
                        {["Customer", "Plan", "Amount", "Method", "Status", "Date"].map(h => (
                          <TableHead key={h} className="text-slate-500 text-xs font-medium">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((p: any, i: number) => (
                        <TableRow key={p.id ?? i} className="border-slate-800 hover:bg-slate-800/40">
                          <TableCell>
                            <p className="text-white text-sm">{p.customer_name || p.name || "—"}</p>
                            <p className="text-slate-500 text-xs">{p.email}</p>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-[10px] px-2 ${PLAN_BADGE[p.plan] ?? PLAN_BADGE.Starter}`}>
                              {p.plan || "—"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-emerald-400 font-semibold text-sm">
                              ₱{Number(p.amount || 0).toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-slate-300 text-xs">{p.method || p.payment_method || "—"}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={p.status === "paid" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]" : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-[10px]"}>
                              {p.status || "pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-slate-500 text-xs">
                              {p.created_at ? new Date(p.created_at).toLocaleDateString("en-PH") : "—"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audits Tab */}
          <TabsContent value="audits" className="mt-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">SEO Audit Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-slate-500 text-sm text-center py-8">Loading audits…</div>
                ) : audits.length === 0 ? (
                  <div className="text-slate-500 text-sm text-center py-8">No audit requests yet.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 hover:bg-transparent">
                        {["Business", "URL / Email", "Score", "Status", "Date"].map(h => (
                          <TableHead key={h} className="text-slate-500 text-xs font-medium">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {audits.map((a: any, i: number) => (
                        <TableRow key={a.id ?? i} className="border-slate-800 hover:bg-slate-800/40">
                          <TableCell>
                            <p className="text-white text-sm">{a.business_name || a.business || "—"}</p>
                            <p className="text-slate-500 text-xs">{a.name}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-slate-300 text-xs">{a.url || a.website || "—"}</p>
                            <p className="text-slate-500 text-xs">{a.email}</p>
                          </TableCell>
                          <TableCell>
                            {a.score != null ? (
                              <span className={`font-bold text-sm ${a.score >= 70 ? "text-emerald-400" : a.score >= 40 ? "text-yellow-400" : "text-red-400"}`}>
                                {a.score}/100
                              </span>
                            ) : <span className="text-slate-500 text-xs">Pending</span>}
                          </TableCell>
                          <TableCell>
                            <Badge className={a.status === "completed" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]" : "bg-blue-500/20 text-blue-300 border-blue-500/30 text-[10px]"}>
                              {a.status || "pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-slate-500 text-xs">
                              {a.created_at ? new Date(a.created_at).toLocaleDateString("en-PH") : "—"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  )
}

// ── Root export ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)

  if (!authed) return <AdminGate onAuth={() => setAuthed(true)} />
  return <AdminDashboard />
}
