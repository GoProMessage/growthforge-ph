"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Plus, Search, TrendingUp, MoreHorizontal, CheckCircle } from "lucide-react"

interface Client {
  id: string
  name: string
  business: string
  plan: "starter" | "growth" | "pro"
  status: "active" | "trial" | "paused"
  mrr: number
  joined: string
  payment: string
  initials: string
  avatarColor: string
}

const initialClients: Client[] = [
  { id: "1", name: "Maria Santos", business: "Santos Bakery", plan: "growth", status: "active", mrr: 2999, joined: "Jan 2024", payment: "GCash", initials: "MS", avatarColor: "bg-rose-100 text-rose-700" },
  { id: "2", name: "Carlo Reyes", business: "RealestatePH", plan: "growth", status: "active", mrr: 2999, joined: "Feb 2024", payment: "Maya", initials: "CR", avatarColor: "bg-blue-100 text-blue-700" },
  { id: "3", name: "Janina Cruz", business: "JC Digital Agency", plan: "pro", status: "active", mrr: 4999, joined: "Dec 2023", payment: "Card", initials: "JC", avatarColor: "bg-purple-100 text-purple-700" },
  { id: "4", name: "Roberto Lim", business: "Lim Hardware", plan: "starter", status: "trial", mrr: 0, joined: "Oct 2024", payment: "GCash", initials: "RL", avatarColor: "bg-gray-100 text-gray-700" },
  { id: "5", name: "Ana Dela Cruz", business: "Ana's Fashion Boutique", plan: "growth", status: "active", mrr: 2999, joined: "Mar 2024", payment: "GCash", initials: "AD", avatarColor: "bg-pink-100 text-pink-700" },
  { id: "6", name: "Jose Mercado", business: "Mercado Fresh Foods", plan: "growth", status: "active", mrr: 2999, joined: "Apr 2024", payment: "Maya", initials: "JM", avatarColor: "bg-green-100 text-green-700" },
  { id: "7", name: "Patricia Tan", business: "PT Business Consultancy", plan: "pro", status: "active", mrr: 4999, joined: "May 2024", payment: "Card", initials: "PT", avatarColor: "bg-amber-100 text-amber-700" },
  { id: "8", name: "Miguel Ramos", business: "Ramos Transport Co.", plan: "starter", status: "paused", mrr: 0, joined: "Jun 2024", payment: "GCash", initials: "MR", avatarColor: "bg-slate-100 text-slate-700" },
]

const planColors: Record<string, string> = {
  starter: "bg-gray-100 text-gray-700 border-0",
  growth: "bg-blue-100 text-blue-700 border-0",
  pro: "bg-purple-100 text-purple-700 border-0",
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700 border-0",
  trial: "bg-amber-100 text-amber-700 border-0",
  paused: "bg-gray-100 text-gray-500 border-0",
}

const GOAL = 168000

export default function ClientsPage() {
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [clients] = useState<Client[]>(initialClients)

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.business.toLowerCase().includes(search.toLowerCase())
  )

  const totalMRR = clients.filter((c) => c.status === "active").reduce((acc, c) => acc + c.mrr, 0)
  const activeClients = clients.filter((c) => c.status === "active").length
  const trialClients = clients.filter((c) => c.status === "trial").length
  const moreNeeded = Math.max(0, Math.ceil((GOAL - totalMRR) / 2999))

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-6xl mx-auto">
      {/* Header — stacks vertically on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Client Management</h1>
          <p className="text-muted-foreground text-sm">Track subscriptions, manage clients, hit your revenue goal</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2 shadow-md shadow-blue-100 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md w-[calc(100vw-2rem)] sm:w-full">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Client Name</Label>
                  <Input placeholder="Full name" />
                </div>
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input placeholder="Business name" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input type="email" placeholder="client@email.com" />
              </div>
              <div className="space-y-2">
                <Label>Mobile (GCash/Maya)</Label>
                <Input placeholder="+63 9XX XXX XXXX" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Subscription Plan</Label>
                  <Select defaultValue="growth">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter — ₱1,499/mo</SelectItem>
                      <SelectItem value="growth">Growth — ₱2,999/mo</SelectItem>
                      <SelectItem value="pro">Pro — ₱4,999/mo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select defaultValue="gcash">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gcash">GCash</SelectItem>
                      <SelectItem value="maya">Maya</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setDialogOpen(false)}>
                Add Client & Send Invite
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <p className="text-xs text-muted-foreground">Total MRR</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-green-600">₱{totalMRR.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">≈ ${Math.round(totalMRR / 56).toLocaleString()} USD</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-500" />
              <p className="text-xs text-muted-foreground">Active Clients</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{activeClients}</p>
            <p className="text-xs text-green-600 mt-0.5 font-medium">+3 this month</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-amber-500" />
              <p className="text-xs text-muted-foreground">On Free Trial</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-amber-600">{trialClients}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Ready to convert</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Search className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-blue-600 font-medium">To $3K Goal</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-blue-700">{moreNeeded}</p>
            <p className="text-xs text-blue-500 mt-0.5">more Growth clients</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-border/60">
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                className="pl-9 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground whitespace-nowrap">{filtered.length} clients</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* overflow-x-auto for mobile horizontal scroll */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4 whitespace-nowrap">Client</TableHead>
                  <TableHead className="whitespace-nowrap">Plan</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">MRR</TableHead>
                  <TableHead className="whitespace-nowrap">Payment</TableHead>
                  <TableHead className="whitespace-nowrap">Joined</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((client) => (
                  <TableRow key={client.id} className="hover:bg-gray-50/50">
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${client.avatarColor} flex-shrink-0`}>
                          {client.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm whitespace-nowrap">{client.name}</p>
                          <p className="text-xs text-muted-foreground whitespace-nowrap">{client.business}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${planColors[client.plan]} capitalize text-xs whitespace-nowrap`}>{client.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[client.status]} capitalize text-xs gap-1 whitespace-nowrap`}>
                        {client.status === "active" && <CheckCircle className="w-3 h-3" />}
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-sm whitespace-nowrap">
                      {client.mrr > 0 ? (
                        <span className="text-green-700">₱{client.mrr.toLocaleString()}</span>
                      ) : (
                        <span className="text-muted-foreground">Trial</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{client.payment}</TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{client.joined}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
