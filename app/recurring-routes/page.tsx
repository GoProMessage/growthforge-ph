"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  RefreshCw, MapPin, Plus, Truck, Package, Calendar,
  Clock, TrendingUp, DollarSign, CheckCircle, AlertCircle,
  Pause, Play, Trash, Edit, ChevronRight, Zap, BarChart3,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { formatCurrency, formatTime12h } from "@/lib/calculator"
import type { RecurringRoute, WeekDay } from "@/types"

// ── Mock data ─────────────────────────────────────────────────────────────────
const DAY_LABELS: Record<WeekDay, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu',
  fri: 'Fri', sat: 'Sat', sun: 'Sun',
}

const FREQ_LABEL: Record<string, string> = {
  daily: 'Every Day',
  weekly: 'Weekly',
  biweekly: 'Bi-Weekly',
  monthly: 'Monthly',
}

const MOCK_ROUTES: RecurringRoute[] = [
  {
    id: 'rr-001', name: 'Charlotte → Atlanta Express',
    shipperId: 'sh-1', shipperName: 'HomeGoods Plus',
    vehicleType: 'sprinter-van',
    pickup: { address: '1201 Hawkins St', city: 'Charlotte', state: 'NC', zip: '28203', lat: 35.22, lng: -80.84 },
    dropoff: { address: '875 Marietta St NW', city: 'Atlanta', state: 'GA', zip: '30318', lat: 33.75, lng: -84.39 },
    pickupTime: '07:00', deliveryTime: '12:00',
    frequency: 'weekly', daysOfWeek: ['mon', 'wed', 'fri'],
    isActive: true,
    startDate: '2026-06-01', nextRunDate: '2026-07-01', lastRunDate: '2026-06-27',
    lastRunStatus: 'completed', totalRuns: 24, distance: 245,
    description: 'Retail store restocking — furniture and home goods.',
    totalCost: 483.75, driverPayout: 459.56,
    createdAt: new Date('2026-06-01'),
  },
  {
    id: 'rr-002', name: 'Raleigh Daily Parts Run',
    shipperId: 'sh-2', shipperName: 'AutoParts Depot',
    vehicleType: 'cargo-van',
    pickup: { address: '300 Industrial Blvd', city: 'Raleigh', state: 'NC', zip: '27601', lat: 35.78, lng: -78.64 },
    dropoff: { address: '145 Commerce Way', city: 'Durham', state: 'NC', zip: '27701', lat: 35.99, lng: -78.90 },
    pickupTime: '06:00', deliveryTime: '08:00',
    frequency: 'daily', daysOfWeek: ['mon', 'tue', 'wed', 'thu', 'fri'],
    isActive: true,
    startDate: '2026-05-15', nextRunDate: '2026-06-30', lastRunDate: '2026-06-28',
    lastRunStatus: 'completed', totalRuns: 45, distance: 30,
    description: 'Automotive parts delivery to dealership.',
    totalCost: 72.50, driverPayout: 68.88,
    createdAt: new Date('2026-05-15'),
  },
  {
    id: 'rr-003', name: 'Columbia → Greenville Bi-Weekly',
    shipperId: 'sh-3', shipperName: 'Palmetto Foods',
    vehicleType: 'box-truck',
    pickup: { address: '2100 Main St', city: 'Columbia', state: 'SC', zip: '29201', lat: 34.00, lng: -81.03 },
    dropoff: { address: '420 Haywood Rd', city: 'Greenville', state: 'SC', zip: '29607', lat: 34.85, lng: -82.40 },
    pickupTime: '09:00', deliveryTime: '14:00',
    frequency: 'biweekly', daysOfWeek: ['tue', 'thu'],
    isActive: false,
    startDate: '2026-04-01', nextRunDate: '2026-07-03', lastRunDate: '2026-06-19',
    lastRunStatus: 'missed', totalRuns: 18, distance: 100,
    description: 'Food distribution to grocery partners.',
    totalCost: 310.00, driverPayout: 294.50,
    createdAt: new Date('2026-04-01'),
  },
  {
    id: 'rr-004', name: 'Savannah Monthly Bulk',
    shipperId: 'sh-4', shipperName: 'Harbor Wholesale',
    vehicleType: 'box-truck',
    pickup: { address: '1 Port Terminal Blvd', city: 'Savannah', state: 'GA', zip: '31401', lat: 32.08, lng: -81.09 },
    dropoff: { address: '800 Peachtree St', city: 'Atlanta', state: 'GA', zip: '30308', lat: 33.77, lng: -84.38 },
    pickupTime: '05:00', deliveryTime: '10:00',
    frequency: 'monthly',
    isActive: true,
    startDate: '2026-01-01', nextRunDate: '2026-07-01', lastRunDate: '2026-06-01',
    lastRunStatus: 'completed', totalRuns: 6, distance: 250,
    description: 'Port-to-warehouse bulk cargo transfer.',
    totalCost: 648.00, driverPayout: 615.60,
    createdAt: new Date('2026-01-01'),
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const VEHICLE_COLORS: Record<string, string> = {
  'cargo-van':    'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'sprinter-van': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'box-truck':    'bg-amber-500/20 text-amber-300 border-amber-500/30',
}
const VEHICLE_EMOJI: Record<string, string> = {
  'cargo-van': '🚐', 'sprinter-van': '🚐', 'box-truck': '🚛',
}

function StatusDot({ status }: { status?: string }) {
  if (status === 'completed') return <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium"><CheckCircle className="h-3 w-3" />Completed</span>
  if (status === 'missed')    return <span className="flex items-center gap-1 text-red-400 text-xs font-medium"><AlertCircle className="h-3 w-3" />Missed</span>
  return <span className="flex items-center gap-1 text-slate-400 text-xs font-medium"><Clock className="h-3 w-3" />Pending</span>
}

function FreqBadge({ freq, days }: { freq: string; days?: WeekDay[] }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <Badge className="bg-orange-500/15 text-orange-400 border-orange-500/25 text-xs gap-1">
        <RefreshCw className="h-3 w-3" />{FREQ_LABEL[freq]}
      </Badge>
      {days?.map(d => (
        <span key={d} className="text-xs bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-medium">
          {DAY_LABELS[d]}
        </span>
      ))}
    </div>
  )
}

// ── Route Card ────────────────────────────────────────────────────────────────
function RouteCard({ route, onToggle, onDelete }: {
  route: RecurringRoute
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={`rounded-2xl border p-5 transition-colors ${
        route.isActive
          ? 'bg-slate-900 border-slate-800'
          : 'bg-slate-900/40 border-slate-800/50 opacity-70'
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-white truncate">{route.name}</span>
            {!route.isActive && (
              <Badge className="bg-slate-700 text-slate-400 border-slate-600 text-xs shrink-0">Paused</Badge>
            )}
          </div>
          <p className="text-slate-500 text-xs truncate">{route.shipperName}</p>
        </div>
        {/* Active toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-slate-500">{route.isActive ? 'Active' : 'Paused'}</span>
          <Switch
            checked={route.isActive}
            onCheckedChange={() => onToggle(route.id)}
            className="data-[state=checked]:bg-emerald-500"
          />
        </div>
      </div>

      {/* Route line */}
      <div className="flex items-center gap-2 mb-4 bg-slate-800/50 rounded-xl p-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 mb-0.5">Pickup</p>
          <p className="text-white text-sm font-semibold truncate">{route.pickup.city}, {route.pickup.state}</p>
          <p className="text-slate-500 text-xs">{formatTime12h(route.pickupTime)}</p>
        </div>
        <div className="flex flex-col items-center gap-1 shrink-0">
          <ChevronRight className="h-4 w-4 text-orange-500" />
          <span className="text-xs text-slate-600">{route.distance} mi</span>
        </div>
        <div className="flex-1 min-w-0 text-right">
          <p className="text-xs text-slate-500 mb-0.5">Dropoff</p>
          <p className="text-white text-sm font-semibold truncate">{route.dropoff.city}, {route.dropoff.state}</p>
          <p className="text-slate-500 text-xs">{formatTime12h(route.deliveryTime)}</p>
        </div>
      </div>

      {/* Frequency + vehicle */}
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <FreqBadge freq={route.frequency} days={route.daysOfWeek} />
        <Badge className={`${VEHICLE_COLORS[route.vehicleType]} text-xs border`}>
          {VEHICLE_EMOJI[route.vehicleType]} {route.vehicleType.replace('-', ' ')}
        </Badge>
      </div>

      <Separator className="bg-slate-800 mb-4" />

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="text-center">
          <p className="text-orange-400 font-bold text-base">{formatCurrency(route.driverPayout)}</p>
          <p className="text-slate-600 text-xs">Per Run</p>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-base">{route.totalRuns ?? 0}</p>
          <p className="text-slate-600 text-xs">Total Runs</p>
        </div>
        <div className="text-center">
          <p className="text-emerald-400 font-bold text-base truncate">{route.nextRunDate?.slice(5) ?? "-"}</p>
          <p className="text-slate-600 text-xs">Next Run</p>
        </div>
        <div className="text-center">
          <StatusDot status={route.lastRunStatus} />
          <p className="text-slate-600 text-xs mt-0.5">Last Run</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 gap-1.5"
          onClick={() => onToggle(route.id)}
        >
          {route.isActive ? <><Pause className="h-3.5 w-3.5" />Pause</> : <><Play className="h-3.5 w-3.5" />Resume</>}
        </Button>
        <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
          <Edit className="h-3.5 w-3.5" />
        </Button>
        <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="border-red-900/50 text-red-400 hover:bg-red-500/10">
              <Trash className="h-3.5 w-3.5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-white">Delete Recurring Route?</DialogTitle>
            </DialogHeader>
            <p className="text-slate-400 text-sm">This will permanently remove <span className="text-white font-medium">"{route.name}"</span> and all future scheduled runs. Past delivery history is preserved.</p>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => setConfirmDelete(false)}>Cancel</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-500 text-white" onClick={() => { onDelete(route.id); setConfirmDelete(false) }}>Delete Route</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function RecurringRoutesPage() {
  const [routes, setRoutes] = useState<RecurringRoute[]>(MOCK_ROUTES)
  const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all')

  const activeCount   = routes.filter(r => r.isActive === true).length
  const pausedCount   = routes.filter(r => !r.isActive === true).length
  const totalRuns     = routes.reduce((s, r) => s + (r.totalRuns ?? 0), 0)
  const totalEarnings = routes.reduce((s, r) => s + r.driverPayout * (r.totalRuns ?? 0), 0)

  const filtered = routes.filter(r => {
    if (filter === 'active') return r.isActive
    if (filter === 'paused') return !r.isActive
    return true
  })

  function toggleActive(id: string) {
    setRoutes(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r))
  }
  function deleteRoute(id: string) {
    setRoutes(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-500/20 p-2 rounded-xl">
                <RefreshCw className="h-6 w-6 text-orange-500" />
              </div>
              <h1 className="text-3xl font-extrabold text-white">Recurring Routes</h1>
            </div>
            <p className="text-slate-400 text-base">Set it once. Run it forever. Automate your repeat deliveries.</p>
          </div>
          <Link href="/post-delivery">
            <Button className="bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2 h-11 px-6">
              <Plus className="h-4 w-4" />
              New Recurring Route
            </Button>
          </Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Routes',    value: activeCount,                       color: 'text-emerald-400', icon: <CheckCircle className="h-5 w-5 text-emerald-500" /> },
            { label: 'Paused Routes',    value: pausedCount,                       color: 'text-slate-400',   icon: <Pause className="h-5 w-5 text-slate-500" /> },
            { label: 'Total Runs',       value: totalRuns,                         color: 'text-white',       icon: <BarChart3 className="h-5 w-5 text-orange-500" /> },
            { label: 'Driver Earnings',  value: formatCurrency(totalEarnings),     color: 'text-orange-400',  icon: <DollarSign className="h-5 w-5 text-orange-500" /> },
          ].map(({ label, value, color, icon }) => (
            <Card key={label} className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-slate-800 rounded-xl p-2.5">{icon}</div>
                <div>
                  <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
                  <p className="text-slate-500 text-xs">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How it works banner */}
        <Card className="bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 mb-8">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold mb-1">How Recurring Routes Work</p>
                <p className="text-slate-400 text-sm">Create a route once with your preferred frequency and days. VanRoute Pro automatically posts it to the Live Board before each scheduled run and matches you with available drivers — no re-entering details every time.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[
                { step: '1', title: 'Set Your Schedule', desc: 'Choose daily, weekly, bi-weekly, or monthly — pick the days that work for your business.' },
                { step: '2', title: 'Auto-Posts to Live Board', desc: 'Your load goes live automatically 2 hours before pickup so drivers can claim it.' },
                { step: '3', title: 'Driver Notified Instantly', desc: 'The first driver to claim gets matched. You get a notification when it\'s confirmed.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="bg-orange-500 text-white text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center shrink-0">{step}</span>
                  <div>
                    <p className="text-white text-sm font-semibold mb-0.5">{title}</p>
                    <p className="text-slate-500 text-xs">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filter tabs + count */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-2">
            {(['all', 'active', 'paused'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-colors ${
                  filter === f
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {f} {f === 'all' ? `(${routes.length})` : f === 'active' ? `(${activeCount})` : `(${pausedCount})`}
              </button>
            ))}
          </div>
          <span className="text-slate-500 text-sm">{filtered.length} route{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Route grid */}
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <RefreshCw className="h-12 w-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-semibold mb-2">No {filter !== 'all' ? filter : ''} recurring routes</p>
            <p className="text-slate-600 text-sm mb-6">Set up your first recurring route and save time on repeat deliveries.</p>
            <Link href="/post-delivery">
              <Button className="bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2">
                <Plus className="h-4 w-4" />Create Your First Route
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map(route => (
                <RouteCard
                  key={route.id}
                  route={route}
                  onToggle={toggleActive}
                  onDelete={deleteRoute}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Upcoming schedule */}
        {routes.some(r => r.isActive) && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              Upcoming Schedule
            </h2>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-0">
                {routes
                  .filter(r => r.isActive)
                  .sort((a, b) => (a.nextRunDate ?? "").localeCompare(b.nextRunDate ?? ""))
                  .map((route, i, arr) => (
                    <div key={route.id} className={`flex items-center gap-4 px-5 py-4 ${i < arr.length - 1 ? 'border-b border-slate-800' : ''}`}>
                      <div className="bg-orange-500/15 rounded-xl p-2.5 shrink-0">
                        <Calendar className="h-4 w-4 text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{route.name}</p>
                        <p className="text-slate-500 text-xs">
                          {route.pickup.city} → {route.dropoff.city} · {formatTime12h(route.pickupTime)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-white text-sm font-bold">{route.nextRunDate}</p>
                        <p className="text-orange-400 text-xs font-semibold">{formatCurrency(route.driverPayout)}</p>
                      </div>
                      <Badge className={`${VEHICLE_COLORS[route.vehicleType]} border text-xs shrink-0`}>
                        {route.vehicleType.replace('-', ' ')}
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* CTA if no routes */}
        {routes.length === 0 && (
          <div className="text-center py-10 mt-4">
            <Link href="/post-delivery">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2">
                <Plus className="h-5 w-5" />
                Create Your First Recurring Route
              </Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
