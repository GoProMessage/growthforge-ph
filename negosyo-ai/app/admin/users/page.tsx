"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Users, Search, MoreHorizontal, DollarSign,
  Activity, Eye, Shield, CheckCircle
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  business: string
  city: string
  plan: "Starter" | "Growth" | "Pro"
  status: "active" | "trial" | "paused" | "churned"
  method: string
  mrr: number
  joined: string
  lastActive: string
  seoAudits: number
  contentGen: number
  websites: number
}

const allUsers: User[] = [
  { id: "1", name: "Maria Santos", email: "maria@santos.ph", business: "Santos Bakery", city: "Cebu City", plan: "Growth", status: "active", method: "GCash", mrr: 2999, joined: "Jan 15, 2026", lastActive: "Today", seoAudits: 24, contentGen: 87, websites: 2 },
  { id: "2", name: "Roberto Lim", email: "roberto@limsupply.ph", business: "Lim Supply Store", city: "Makati", plan: "Pro", status: "active", method: "Maya", mrr: 4999, joined: "Jan 22, 2026", lastActive: "Today", seoAudits: 56, contentGen: 213, websites: 4 },
  { id: "3", name: "Ana Reyes", email: "ana@reyeslaw.ph", business: "Reyes Law Office", city: "BGC", plan: "Pro", status: "active", method: "Card", mrr: 4999, joined: "Feb 3, 2026", lastActive: "Yesterday", seoAudits: 18, contentGen: 44, websites: 1 },
  { id: "4", name: "Carlo dela Cruz", email: "carlo@dctrading.ph", business: "DC Trading", city: "Quezon City", plan: "Growth", status: "active", method: "GCash", mrr: 2999, joined: "Feb 14, 2026", lastActive: "2 days ago", seoAudits: 31, contentGen: 102, websites: 3 },
  { id: "5", name: "Grace Tan", email: "grace@graceclinic.ph", business: "Grace Medical Clinic", city: "Davao", plan: "Growth", status: "active", method: "GCash", mrr: 2999, joined: "Mar 1, 2026", lastActive: "Today", seoAudits: 12, contentGen: 67, websites: 1 },
  { id: "6", name: "Jun Villanueva", email: "jun@vsolutions.ph", business: "V Solutions IT", city: "Manila", plan: "Starter", status: "trial", method: "Maya", mrr: 0, joined: "Jun 20, 2026", lastActive: "Today", seoAudits: 3, contentGen: 8, websites: 0 },
  { id: "7", name: "Lea Gomez", email: "lea@leaboutique.ph", business: "Lea Fashion Boutique", city: "Iloilo", plan: "Starter", status: "active", method: "GCash", mrr: 1499, joined: "Apr 10, 2026", lastActive: "3 days ago", seoAudits: 8, contentGen: 34, websites: 1 },
  { id: "8", name: "Mike Ocampo", email: "mike@ocampofoods.ph", business: "Ocampo Foods", city: "Pampanga", plan: "Growth", status: "trial", method: "GCash", mrr: 0, joined: "Jun 18, 2026", lastActive: "Today", seoAudits: 4, contentGen: 11, websites: 0 },
  { id: "9", name: "Donna Cruz", email: "donna@dcrealtor.ph", business: "DC Realty", city: "Paranaque", plan: "Pro", status: "active", method: "Maya", mrr: 4999, joined: "Feb 28, 2026", lastActive: "Today", seoAudits: 45, contentGen: 178, websites: 5 },
  { id: "10", name: "Tony Flores", email: "tony@floresauto.ph", business: "Flores Auto Supply", city: "Batangas", plan: "Growth", status: "paused", method: "Card", mrr: 0, joined: "Mar 15, 2026", lastActive: "2 weeks ago", seoAudits: 14, contentGen: 29, websites: 1 },
]

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  trial: "bg-blue-100 text-blue-700",
  paused: "bg-amber-100 text-amber-700",
  churned: "bg-red-100 text-red-700",
}

const planColors: Record<string, string> = {
  Pro: "bg-amber-100 text-amber-700",
  Growth: "bg-violet-100 text-violet-700",
  Starter: "bg-gray-100 text-gray-600",
}

function UserDetailDialog({ user }: { user: User }) {
  return (
    <DialogContent className="max-w-lg w-[calc(100vw-2rem)] sm:w-full">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
            {user.name[0]}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-gray-900 truncate">{user.name}</div>
            <div className="text-sm text-gray-500 font-normal truncate">{user.business}</div>
          </div>
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Email", value: user.email },
            { label: "City", value: user.city },
            { label: "Plan", value: user.plan },
            { label: "Payment", value: user.method },
            { label: "Joined", value: user.joined },
            { label: "Last Active", value: user.lastActive },
          ].map((r) => (
            <div key={r.label} className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400">{r.label}</p>
              <p className="text-sm font-medium text-gray-900 truncate">{r.value}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Tool Usage</p>
          <div className="space-y-2">
            {[
              { label: "SEO Audits", used: user.seoAudits, max: 50 },
              { label: "Content Generated", used: user.contentGen, max: 200 },
              { label: "Websites Built", used: user.websites, max: 5 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{item.label}</span><span>{item.used}/{item.max}</span>
                </div>
                <Progress value={(item.used / item.max) * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-violet-50 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-violet-500">Monthly Revenue</p>
            <p className="text-2xl font-black text-violet-700">
              {user.mrr > 0 ? `₱${user.mrr.toLocaleString()}` : "₱0 (Trial)"}
            </p>
          </div>
          <Badge className={`${statusColors[user.status]} border-0 capitalize text-sm`}>
            {user.status}
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" className="text-xs">Upgrade</Button>
          <Button variant="outline" size="sm" className="text-xs">Email</Button>
          <Button variant="outline" size="sm" className="text-xs text-red-500 hover:text-red-600">Suspend</Button>
        </div>
      </div>
    </DialogContent>
  )
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  const filtered = allUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.business.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" ? true : u.status === filter
    return matchSearch && matchFilter
  })

  const stats = {
    total: allUsers.length,
    active: allUsers.filter(u => u.status === "active").length,
    trial: allUsers.filter(u => u.status === "trial").length,
    paused: allUsers.filter(u => u.status === "paused").length,
    mrr: allUsers.filter(u => u.status === "active").reduce((sum, u) => sum + u.mrr, 0),
  }

  const filters = ["all", "active", "trial", "paused", "churned"]

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-violet-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Users & Clients</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">All {stats.total} registered users across the platform</p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2 w-full sm:w-auto" size="sm">
          <Shield className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Users", value: stats.total, icon: Users, color: "text-gray-700" },
          { label: "Active Paid", value: stats.active, icon: CheckCircle, color: "text-green-600" },
          { label: "Free Trial", value: stats.trial, icon: Activity, color: "text-blue-600" },
          { label: "Paused", value: stats.paused, icon: MoreHorizontal, color: "text-amber-600" },
          { label: "Active MRR", value: `₱${stats.mrr.toLocaleString()}`, icon: DollarSign, color: "text-violet-600" },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
              <p className="text-lg sm:text-xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-9 h-9 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Filter pills — scrollable on mobile */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 flex-nowrap">
              {filters.map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "ghost"}
                  size="sm"
                  className={`capitalize text-xs h-7 whitespace-nowrap flex-shrink-0 ${filter === f ? "bg-violet-600 text-white hover:bg-violet-700" : "text-gray-600"}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* overflow-x-auto so table scrolls on narrow screens */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-0">
                  <TableHead className="pl-6 text-xs font-semibold text-gray-500 whitespace-nowrap">User</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 whitespace-nowrap">Plan</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 whitespace-nowrap">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 whitespace-nowrap">Payment</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 whitespace-nowrap">MRR</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 whitespace-nowrap">Last Active</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 whitespace-nowrap">Tools</TableHead>
                  <TableHead className="pr-6 text-xs font-semibold text-gray-500 whitespace-nowrap">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50/80">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {user.name[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">{user.name}</p>
                          <p className="text-xs text-gray-400 whitespace-nowrap">{user.business}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${planColors[user.plan]} border-0 text-xs whitespace-nowrap`}>{user.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[user.status]} border-0 text-xs capitalize whitespace-nowrap`}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-600 whitespace-nowrap">{user.method}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-semibold whitespace-nowrap ${user.mrr > 0 ? "text-green-600" : "text-gray-400"}`}>
                        {user.mrr > 0 ? `₱${user.mrr.toLocaleString()}` : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{user.lastActive}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge className="bg-gray-100 text-gray-600 border-0 text-[10px] whitespace-nowrap">{user.seoAudits} SEO</Badge>
                        <Badge className="bg-gray-100 text-gray-600 border-0 text-[10px] whitespace-nowrap">{user.contentGen} AI</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="pr-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Eye className="w-3.5 h-3.5 text-gray-400" />
                          </Button>
                        </DialogTrigger>
                        <UserDetailDialog user={user} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No users match your search</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
