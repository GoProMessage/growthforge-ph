"use client"

import { useState } from "react"
import { Truck, Package, Users, DollarSign, RefreshCw, Lock, BarChart3, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Delivery, Driver, Shipper } from "@/types"

// ── Auth guard ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("")
  const [err, setErr] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw === "vanroute2024") { onLogin() }
    else { setErr(true); setTimeout(() => setErr(false), 2000) }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/30 mb-2">
            <Truck className="h-7 w-7 text-orange-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">VanRoute Pro</h1>
          <p className="text-slate-400 text-sm">Admin Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
            {err && <p className="text-red-400 text-xs mt-1">Incorrect password</p>}
          </div>
          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: string | number; icon: React.ElementType; color: string; sub?: string
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-400 text-sm">{label}</p>
        <div className={`p-2 rounded-lg ${color.replace("text-", "bg-").replace("400", "500/20")}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </div>
      <p className="text-2xl font-extrabold text-white">{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    available: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    assigned: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "in-transit": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  }
  return (
    <Badge className={`text-xs border ${map[status] ?? "bg-slate-800 text-slate-400 border-slate-700"}`}>
      {status}
    </Badge>
  )
}

// ── Placeholder data ────────────────────────────────────────────────────────
function makeLocation(city: string, state: string) {
  return { address: "123 Main St", city, state: state as "SC" | "NC" | "GA", zip: "29000", lat: 0, lng: 0 }
}

function placeholderDeliveries(): Delivery[] {
  return [
    {
      id: "d001", shipperId: "s1", shipperName: "LowCountry Freight", vehicleType: "cargo-van",
      pickup: makeLocation("Columbia", "SC"), dropoff: makeLocation("Charlotte", "NC"),
      pickupDate: "2026-06-29", pickupTime: "09:00", deliveryDate: "2026-06-29", deliveryTime: "13:00",
      distance: 95, baseFee: 35, mileageRate: 1.25, mileageCost: 118.75, totalCost: 153.75,
      platformFee: 15.38, driverPayout: 138.37, description: "Office supplies",
      isScheduled: false, isUrgent: false, postedAt: new Date(), expiresAt: new Date(),
      status: "in-transit",
    },
    {
      id: "d002", shipperId: "s2", shipperName: "Piedmont Wholesale", vehicleType: "sprinter-van",
      pickup: makeLocation("Raleigh", "NC"), dropoff: makeLocation("Greenville", "SC"),
      pickupDate: "2026-06-30", pickupTime: "14:00", deliveryDate: "2026-06-30", deliveryTime: "19:00",
      distance: 120, baseFee: 55, mileageRate: 1.75, mileageCost: 210, totalCost: 265,
      platformFee: 26.5, driverPayout: 238.5, description: "Wholesale goods",
      isScheduled: false, isUrgent: false, postedAt: new Date(), expiresAt: new Date(),
      status: "available",
    },
    {
      id: "d003", shipperId: "s1", shipperName: "LowCountry Freight", vehicleType: "sprinter-van",
      pickup: makeLocation("Atlanta", "GA"), dropoff: makeLocation("Spartanburg", "SC"),
      pickupDate: "2026-06-28", pickupTime: "07:00", deliveryDate: "2026-06-28", deliveryTime: "12:00",
      distance: 200, baseFee: 55, mileageRate: 1.75, mileageCost: 350, totalCost: 405,
      platformFee: 40.5, driverPayout: 364.5, description: "Auto parts",
      isScheduled: false, isUrgent: false, postedAt: new Date(), expiresAt: new Date(),
      status: "completed",
    },
  ]
}

function placeholderDrivers(): Driver[] {
  return [
    {
      id: "drv001", name: "Marcus T.", email: "marcus@example.com", phone: "843-555-0101",
      vehicleType: "sprinter-van", vehicleYear: "2022", vehicleMake: "Mercedes", vehicleModel: "Sprinter",
      licensePlate: "SC-1234", rating: 4.9, completedDeliveries: 87, totalEarnings: 14200,
      isAvailable: true, currentCity: "Columbia", currentState: "SC", joinedDate: "2025-01-10",
    },
    {
      id: "drv002", name: "Raymond K.", email: "raymond@example.com", phone: "704-555-0202",
      vehicleType: "cargo-van", vehicleYear: "2021", vehicleMake: "Ford", vehicleModel: "Transit",
      licensePlate: "NC-5678", rating: 4.7, completedDeliveries: 43, totalEarnings: 6800,
      isAvailable: true, currentCity: "Charlotte", currentState: "NC", joinedDate: "2025-03-15",
    },
    {
      id: "drv003", name: "Deja W.", email: "deja@example.com", phone: "404-555-0303",
      vehicleType: "cargo-van", vehicleYear: "2020", vehicleMake: "Chevy", vehicleModel: "Express",
      licensePlate: "GA-9012", rating: 5.0, completedDeliveries: 22, totalEarnings: 3400,
      isAvailable: false, currentCity: "Atlanta", currentState: "GA", joinedDate: "2025-05-20",
    },
  ]
}

function placeholderShippers(): Shipper[] {
  return [
    { id: "shp001", name: "LowCountry Freight LLC", email: "ops@lcfreight.com", phone: "843-555-0401", company: "LowCountry Freight", totalDeliveries: 18, totalSpent: 4280, rating: 4.8 },
    { id: "shp002", name: "Piedmont Wholesale", email: "ship@piedmontwholesale.com", phone: "704-555-0502", company: "Piedmont Wholesale", totalDeliveries: 9, totalSpent: 2100, rating: 4.6 },
  ]
}

const WEEKLY_CHART = [
  { day: "Mon", deliveries: 8, revenue: 1240 },
  { day: "Tue", deliveries: 12, revenue: 1890 },
  { day: "Wed", deliveries: 7, revenue: 1020 },
  { day: "Thu", deliveries: 15, revenue: 2340 },
  { day: "Fri", deliveries: 18, revenue: 2800 },
  { day: "Sat", deliveries: 11, revenue: 1680 },
  { day: "Sun", deliveries: 5, revenue: 780 },
]

// ── Main dashboard ─────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<"overview" | "deliveries" | "drivers" | "shippers">("overview")
  const [spinning, setSpinning] = useState(false)

  const deliveries = placeholderDeliveries()
  const drivers = placeholderDrivers()
  const shippers = placeholderShippers()

  const totalRevenue = deliveries.filter(d => d.status === "completed").reduce((s, d) => s + d.driverPayout, 0)
  const activeLoads = deliveries.filter(d => d.status === "in-transit" || d.status === "available").length
  const activeDrivers = drivers.filter(d => d.isAvailable).length

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <Truck className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg leading-none">VanRoute Pro Admin</h1>
              <p className="text-slate-500 text-xs mt-0.5">SC · NC · GA Logistics Network</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setSpinning(true); setTimeout(() => setSpinning(false), 800) }}
            className="text-slate-400 hover:text-white gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${spinning ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 w-fit overflow-x-auto">
          {(["overview", "deliveries", "drivers", "shippers"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all whitespace-nowrap ${
                tab === t ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Active Loads" value={activeLoads} icon={Package} color="text-orange-400" sub="available + in-transit" />
              <StatCard label="Available Drivers" value={activeDrivers} icon={Users} color="text-blue-400" sub="online now" />
              <StatCard label="Revenue Paid Out" value={`$${totalRevenue.toFixed(2)}`} icon={DollarSign} color="text-emerald-400" sub="completed routes" />
              <StatCard label="Total Shippers" value={shippers.length} icon={BarChart3} color="text-purple-400" sub="registered" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-orange-400" /> Weekly Deliveries
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={WEEKLY_CHART}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8 }} />
                    <Bar dataKey="deliveries" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-400" /> Weekly Revenue
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={WEEKLY_CHART}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8 }} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── Deliveries ── */}
        {tab === "deliveries" && (
          <div className="space-y-4">
            <h2 className="font-extrabold text-xl">Deliveries ({deliveries.length})</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800/50">
                    <tr>
                      {["ID", "Pickup", "Dropoff", "Dist", "Vehicle", "Payout", "Date", "Status"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-slate-400 font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {deliveries.map(d => (
                      <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-slate-400 text-xs">{d.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-500" />{d.pickup.city}, {d.pickup.state}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-orange-400" />{d.dropoff.city}, {d.dropoff.state}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{d.distance} mi</td>
                        <td className="px-4 py-3">
                          <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-xs">{d.vehicleType}</Badge>
                        </td>
                        <td className="px-4 py-3 text-emerald-400 font-bold">${d.driverPayout.toFixed(2)}</td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />{d.pickupDate}
                          </span>
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Drivers ── */}
        {tab === "drivers" && (
          <div className="space-y-4">
            <h2 className="font-extrabold text-xl">Drivers ({drivers.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drivers.map(d => (
                <div key={d.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-sm">
                        {d.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-bold text-white">{d.name}</p>
                        <p className="text-slate-500 text-xs">{d.currentCity}, {d.currentState} · {d.vehicleType}</p>
                      </div>
                    </div>
                    {d.isAvailable
                      ? <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">Available</Badge>
                      : <Badge className="bg-slate-800 text-slate-400 border-slate-700 text-xs">Offline</Badge>}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Rating", value: d.rating.toFixed(1) },
                      { label: "Deliveries", value: d.completedDeliveries },
                      { label: "Earnings", value: `$${(d.totalEarnings / 1000).toFixed(1)}k` },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-slate-800 rounded-lg p-2 text-center">
                        <p className="text-white font-bold text-sm">{value}</p>
                        <p className="text-slate-500 text-xs">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-slate-400 text-xs space-y-1">
                    <p>{d.email}</p>
                    <p>{d.phone}</p>
                    <p className="text-slate-500">{d.vehicleYear} {d.vehicleMake} {d.vehicleModel} · {d.licensePlate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Shippers ── */}
        {tab === "shippers" && (
          <div className="space-y-4">
            <h2 className="font-extrabold text-xl">Shippers ({shippers.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shippers.map(s => (
                <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-lg">{s.company ?? s.name}</p>
                      <p className="text-slate-400 text-sm">{s.name}</p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-800 rounded-xl p-3 text-center">
                      <p className="text-white font-bold">{s.totalDeliveries}</p>
                      <p className="text-slate-500 text-xs">Loads</p>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-3 text-center">
                      <p className="text-emerald-400 font-bold">${s.totalSpent.toLocaleString()}</p>
                      <p className="text-slate-500 text-xs">Total Spent</p>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-3 text-center">
                      <p className="text-yellow-400 font-bold">{s.rating.toFixed(1)}</p>
                      <p className="text-slate-500 text-xs">Rating</p>
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs space-y-1">
                    <p>{s.email}</p>
                    <p>{s.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
