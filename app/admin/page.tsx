"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ADMIN_STATS, MOCK_DELIVERIES, MOCK_DRIVERS, MOCK_SHIPPERS } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/calculator"
import { AdminGate } from "@/components/admin-gate"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts"
import {
  BarChart3, Truck, Users, DollarSign, Package, TrendingUp,
  Search, Shield, Activity, CheckCircle, Clock,
  MapPin, Star, Share, Zap, Percent,
} from "lucide-react"
import { ShareModal } from "@/components/share-modal"
import { formatDistanceToNow } from "date-fns"

const ORANGE = '#f97316'
const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899']

const VEHICLE_BADGE: Record<string, string> = {
  'sprinter-van': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'cargo-van':    'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'box-truck':    'bg-amber-500/20 text-amber-300 border-amber-500/30',
}
const VEHICLE_LABEL: Record<string, string> = {
  'sprinter-van': 'Sprinter',
  'cargo-van':    'Cargo Van',
  'box-truck':    'Box Truck',
}

function AdminDashboard() {
  const [search, setSearch] = useState('')
  const s = ADMIN_STATS

  const filteredDeliveries = MOCK_DELIVERIES.filter(d =>
    search === '' ||
    d.pickup.city.toLowerCase().includes(search.toLowerCase()) ||
    d.dropoff.city.toLowerCase().includes(search.toLowerCase()) ||
    (d.shipperCompany || d.shipperName).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Admin Header */}
      <div className="border-b border-slate-800 bg-slate-900/60 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-orange-500" />
            <div>
              <h1 className="text-white font-bold text-lg">Admin Dashboard</h1>
              <p className="text-slate-500 text-xs">VanRoute Pro · SC · NC · GA · Owner Access</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 text-xs font-semibold">Platform Live</span>
            </div>
            <ShareModal trigger={
              <Button variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:text-white gap-2">
                <Share className="h-4 w-4" />
                Share Platform
              </Button>
            } />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Platform Revenue Highlight */}
        <div className="bg-gradient-to-r from-orange-500/15 via-orange-500/10 to-transparent border border-orange-500/30 rounded-2xl p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                <Percent className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <p className="text-orange-300 font-bold text-lg">Platform Revenue (5% Fee)</p>
                <p className="text-slate-400 text-sm">VanRoute Pro earns 5% on every completed delivery</p>
              </div>
            </div>
            <div className="sm:ml-auto grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-orange-400 font-extrabold text-2xl">{formatCurrency(s.platformRevenue)}</p>
                <p className="text-slate-500 text-xs">YTD Platform Earnings</p>
              </div>
              <div className="text-center">
                <p className="text-emerald-400 font-extrabold text-2xl">{formatCurrency(s.revenueByMonth[s.revenueByMonth.length - 1].platformCut)}</p>
                <p className="text-slate-500 text-xs">This Month</p>
              </div>
              <div className="text-center">
                <p className="text-blue-400 font-extrabold text-2xl">5%</p>
                <p className="text-slate-500 text-xs">Commission Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Revenue (All)', value: formatCurrency(s.totalRevenue), icon: DollarSign, color: 'text-orange-400', bg: 'bg-orange-500/10', change: '+12.4%' },
            { label: 'Active Deliveries', value: s.activeDeliveries, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10', change: '+3 today' },
            { label: 'Total Drivers', value: s.totalDrivers, icon: Truck, color: 'text-blue-400', bg: 'bg-blue-500/10', change: `${s.activeDrivers} active` },
            { label: 'Total Shippers', value: s.totalShippers, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10', change: `${s.activeShippers} active` },
          ].map(({ label, value, icon: Icon, color, bg, change }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">{change}</Badge>
                  </div>
                  <p className="text-white font-extrabold text-2xl">{value}</p>
                  <p className="text-slate-500 text-sm">{label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Completed Deliveries', value: s.completedDeliveries.toLocaleString(), icon: CheckCircle, color: 'text-emerald-400' },
            { label: 'In-Transit / Active', value: s.activeDeliveries, icon: Clock, color: 'text-yellow-400' },
            { label: 'Live on Board', value: MOCK_DELIVERIES.filter(d => d.status === 'available').length, icon: Package, color: 'text-blue-400' },
            { label: '⚡ One Rail Loads', value: MOCK_DELIVERIES.filter(d => d.source === 'OneRail').length, icon: Zap, color: 'text-blue-300' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className={`h-5 w-5 ${color} shrink-0`} />
                <div>
                  <p className="text-white font-bold text-lg">{value}</p>
                  <p className="text-slate-500 text-xs">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue + Platform Cut Chart */}
          <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                Revenue vs Platform Cut (2026)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={s.revenueByMonth}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cutGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis stroke="#475569" tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }}
                    formatter={(v: number, name: string) => [formatCurrency(v), name === 'revenue' ? 'Total Revenue' : 'Platform Cut (5%)']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke={ORANGE} strokeWidth={2} fill="url(#revGrad)" />
                  <Area type="monotone" dataKey="platformCut" stroke="#10b981" strokeWidth={2} fill="url(#cutGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* State Distribution */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                By State
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={s.deliveriesByState} cx="50%" cy="50%" outerRadius={80} dataKey="count" nameKey="state"
                    label={({ state, percent }) => `${state} ${(percent * 100).toFixed(0)}%`}>
                    {s.deliveriesByState.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Types + Top Routes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Truck className="h-4 w-4 text-orange-500" />
                Deliveries by Vehicle Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={s.deliveriesByVehicle}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="type" stroke="#475569" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis stroke="#475569" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {s.deliveriesByVehicle.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-base">Top Routes This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { route: 'Charlotte → Raleigh', count: 47, revenue: 10340 },
                  { route: 'Atlanta → Savannah', count: 38, revenue: 10830 },
                  { route: 'Columbia → Charleston', count: 29, revenue: 5510 },
                  { route: 'Greensboro → Durham', count: 24, revenue: 3360 },
                  { route: 'Greenville → Charlotte', count: 19, revenue: 4185 },
                ].map(({ route, count, revenue }, i) => (
                  <div key={route} className="flex items-center gap-3">
                    <span className="text-slate-600 text-sm w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-300 text-sm font-medium truncate">{route}</p>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1">
                        <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${(count / 47) * 100}%` }} />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-white text-sm font-semibold">{count}</p>
                      <p className="text-slate-600 text-xs">{formatCurrency(revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="deliveries">
          <TabsList className="bg-slate-900 border border-slate-800 mb-4">
            <TabsTrigger value="deliveries" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-slate-400">
              Deliveries ({MOCK_DELIVERIES.length})
            </TabsTrigger>
            <TabsTrigger value="drivers" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-slate-400">
              Drivers ({MOCK_DRIVERS.length})
            </TabsTrigger>
            <TabsTrigger value="shippers" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-slate-400">
              Shippers ({MOCK_SHIPPERS.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deliveries">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search deliveries..." className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-9" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-400">Route</TableHead>
                        <TableHead className="text-slate-400">Vehicle</TableHead>
                        <TableHead className="text-slate-400">Source</TableHead>
                        <TableHead className="text-slate-400">Shipper</TableHead>
                        <TableHead className="text-slate-400">Total</TableHead>
                        <TableHead className="text-slate-400">Driver Pay</TableHead>
                        <TableHead className="text-slate-400">Platform Fee</TableHead>
                        <TableHead className="text-slate-400">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDeliveries.slice(0, 20).map(d => (
                        <TableRow key={d.id} className="border-slate-800 hover:bg-slate-800/40 transition-colors">
                          <TableCell className="text-white text-sm">
                            {d.pickup.city} → {d.dropoff.city}
                            <span className="text-slate-600 text-xs ml-1">({d.distance}mi)</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${VEHICLE_BADGE[d.vehicleType]}`}>
                              {VEHICLE_LABEL[d.vehicleType]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {d.source === 'OneRail'
                              ? <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">⚡ One Rail</Badge>
                              : <span className="text-slate-500 text-xs">{d.source}</span>
                            }
                          </TableCell>
                          <TableCell className="text-slate-400 text-sm">{d.shipperCompany || d.shipperName}</TableCell>
                          <TableCell className="text-orange-400 font-semibold">{formatCurrency(d.totalCost)}</TableCell>
                          <TableCell className="text-emerald-400 font-semibold">{formatCurrency(d.driverPayout)}</TableCell>
                          <TableCell className="text-purple-400 font-semibold">{formatCurrency(d.platformFee)}</TableCell>
                          <TableCell>
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">Available</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drivers">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-400">Driver</TableHead>
                        <TableHead className="text-slate-400">Vehicle</TableHead>
                        <TableHead className="text-slate-400">Rating</TableHead>
                        <TableHead className="text-slate-400">Deliveries</TableHead>
                        <TableHead className="text-slate-400">Earnings</TableHead>
                        <TableHead className="text-slate-400">Location</TableHead>
                        <TableHead className="text-slate-400">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_DRIVERS.map(d => (
                        <TableRow key={d.id} className="border-slate-800 hover:bg-slate-800/40">
                          <TableCell>
                            <div>
                              <p className="text-white font-semibold text-sm">{d.name}</p>
                              <p className="text-slate-500 text-xs">{d.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-400 text-sm">{d.vehicleYear} {d.vehicleMake} {d.vehicleModel}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 text-orange-400 fill-orange-400" />
                              <span className="text-white text-sm font-semibold">{d.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300">{d.completedDeliveries}</TableCell>
                          <TableCell className="text-emerald-400 font-semibold">{formatCurrency(d.totalEarnings)}</TableCell>
                          <TableCell className="text-slate-400 text-sm">{d.currentCity}, {d.currentState}</TableCell>
                          <TableCell>
                            <Badge className={d.isAvailable
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs'
                              : 'bg-slate-800 text-slate-500 border-slate-700 text-xs'}>
                              {d.isAvailable ? 'Available' : 'Off Duty'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shippers">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-400">Shipper</TableHead>
                        <TableHead className="text-slate-400">Company</TableHead>
                        <TableHead className="text-slate-400">Contact</TableHead>
                        <TableHead className="text-slate-400">Deliveries</TableHead>
                        <TableHead className="text-slate-400">Total Spent</TableHead>
                        <TableHead className="text-slate-400">Platform Earned</TableHead>
                        <TableHead className="text-slate-400">Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_SHIPPERS.map(shipper => (
                        <TableRow key={shipper.id} className="border-slate-800 hover:bg-slate-800/40">
                          <TableCell className="text-white font-semibold text-sm">{shipper.name}</TableCell>
                          <TableCell className="text-slate-400 text-sm">{shipper.company || '—'}</TableCell>
                          <TableCell>
                            <div>
                              <p className="text-slate-300 text-xs">{shipper.email}</p>
                              <p className="text-slate-500 text-xs">{shipper.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300">{shipper.totalDeliveries}</TableCell>
                          <TableCell className="text-orange-400 font-semibold">{formatCurrency(shipper.totalSpent)}</TableCell>
                          <TableCell className="text-purple-400 font-semibold">{formatCurrency(shipper.totalSpent * 0.05)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 text-orange-400 fill-orange-400" />
                              <span className="text-white text-sm">{shipper.rating}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <AdminGate>
      <AdminDashboard />
    </AdminGate>
  )
}
