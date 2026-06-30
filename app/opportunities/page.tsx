"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { generateNewDelivery } from "@/lib/mock-data"
import { DeliveryCard } from "@/components/delivery-card"
import { ShareModal } from "@/components/share-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Delivery } from "@/types"
import { formatCurrency } from "@/lib/calculator"
import {
  Search, Filter, RefreshCw, Zap, Truck, MapPin,
  TrendingUp, Bell, X, Clock, Package, Shield,
} from "lucide-react"

type SortOption = 'newest' | 'highest-pay' | 'closest' | 'urgent'
type VehicleFilter = 'all' | 'cargo-van' | 'sprinter-van' | 'box-truck'

const SOURCE_BADGE: Record<string, { label: string; cls: string }> = {
  OneRail: { label: '⚡ One Rail Logistics', cls: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  direct:  { label: 'Direct Shipper',        cls: 'bg-slate-700 text-slate-300 border-slate-600'   },
  posted:  { label: 'Posted Load',            cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
}

/** ms remaining until expiry */
function msLeft(d: Delivery): number {
  return new Date(d.expiresAt).getTime() - Date.now()
}

function expiryLabel(d: Delivery): { text: string; urgent: boolean } {
  const mins = Math.round(msLeft(d) / 60000)
  if (mins <= 0) return { text: 'Expired', urgent: true }
  if (mins <= 5) return { text: `${mins}m left`, urgent: true }
  if (mins <= 15) return { text: `${mins}m left`, urgent: false }
  return { text: `${mins}m`, urgent: false }
}

export default function OpportunitiesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [newDeliveryIds, setNewDeliveryIds] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState<string>('all')
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [scanPulse, setScanPulse] = useState(true)
  const [notification, setNotification] = useState<{ text: string; type: string } | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [expiredCount, setExpiredCount] = useState(0)
  const [, forceRefresh] = useState(0) // trigger re-render for countdown

  // Pulse animation
  useEffect(() => {
    const iv = setInterval(() => setScanPulse(p => !p), 1500)
    return () => clearInterval(iv)
  }, [])

  // ── Initial load from API (Supabase) ──────────────────────────────────
  useEffect(() => {
    setLoading(true)
    fetch('/api/deliveries')
      .then(r => r.json())
      .then(data => {
        if (data.deliveries) {
          setDeliveries(data.deliveries.map((d: Delivery) => ({
            ...d,
            postedAt: new Date(d.postedAt),
            expiresAt: new Date(d.expiresAt),
          })).filter((d: Delivery) => msLeft(d) > 0))
        }
      })
      .catch(err => console.error('Failed to load deliveries:', err))
      .finally(() => setLoading(false))
  }, [])

  // ── Expiry: purge expired loads every 30 seconds + update countdowns ──
  useEffect(() => {
    const purge = setInterval(() => {
      setDeliveries(prev => {
        const before = prev.length
        const active = prev.filter(d => msLeft(d) > 0)
        const removed = before - active.length
        if (removed > 0) {
          setExpiredCount(c => c + removed)
          setNotification({ text: `${removed} load${removed > 1 ? 's' : ''} claimed — removed from board`, type: 'expire' })
          setTimeout(() => setNotification(null), 4000)
        }
        return active
      })
      // Refresh countdown labels
      forceRefresh(n => n + 1)
    }, 30000)
    // Faster countdown refresh every 60 seconds for visual accuracy
    const tick = setInterval(() => forceRefresh(n => n + 1), 60000)
    return () => { clearInterval(purge); clearInterval(tick) }
  }, [])

  // ── Live feed: new load every 35 seconds ──────────────────────────────
  useEffect(() => {
    const feed = setInterval(() => {
      const newDel = generateNewDelivery()
      setDeliveries(prev => [newDel, ...prev])
      setNewDeliveryIds(prev => new Set(prev).add(newDel.id))
      const src = newDel.source === 'OneRail' ? '⚡ One Rail Logistics' : 'New shipper'
      setNotification({ text: `New ${newDel.vehicleType.replace('-', ' ')} load — ${newDel.pickup.city} → ${newDel.dropoff.city} (${src})`, type: 'new' })
      setTimeout(() => {
        setNewDeliveryIds(prev => { const s = new Set(prev); s.delete(newDel.id); return s })
        setNotification(null)
      }, 12000)
    }, 35000)
    return () => clearInterval(feed)
  }, [])

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    fetch('/api/deliveries')
      .then(r => r.json())
      .then(data => {
        if (data.deliveries) {
          const fresh = data.deliveries.map((d: Delivery) => ({
            ...d,
            postedAt: new Date(d.postedAt),
            expiresAt: new Date(d.expiresAt),
          })).filter((d: Delivery) => msLeft(d) > 0)
          const currentIds = new Set(deliveries.map(d => d.id))
          const newOnes = fresh.filter((d: Delivery) => !currentIds.has(d.id))
          setDeliveries(fresh)
          if (newOnes.length > 0) {
            newOnes.forEach((d: Delivery) => setNewDeliveryIds(prev => new Set(prev).add(d.id)))
            setNotification({ text: `Scan complete — ${newOnes.length} new load${newOnes.length > 1 ? 's' : ''} found`, type: 'new' })
          } else {
            setNotification({ text: 'Board refreshed — all loads current', type: 'info' })
          }
          setTimeout(() => setNotification(null), 4000)
        }
      })
      .catch(() => setNotification({ text: 'Refresh failed — check connection', type: 'expire' }))
      .finally(() => setIsRefreshing(false))
  }, [deliveries])

  // ── Filtering & sorting ────────────────────────────────────────────────
  const filtered = deliveries
    .filter(d => {
      if (search) {
        const q = search.toLowerCase()
        const hit = d.pickup.city.toLowerCase().includes(q) ||
          d.dropoff.city.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          (d.shipperCompany ?? '').toLowerCase().includes(q)
        if (!hit) return false
      }
      if (stateFilter !== 'all' && d.pickup.state !== stateFilter && d.dropoff.state !== stateFilter) return false
      if (vehicleFilter !== 'all' && d.vehicleType !== vehicleFilter) return false
      if (sourceFilter !== 'all' && d.source !== sourceFilter) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'highest-pay') return b.totalCost - a.totalCost
      if (sortBy === 'closest') return a.distance - b.distance
      if (sortBy === 'urgent') return (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0)
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    })

  const availableCount = deliveries.filter(d => d.status === 'available').length
  const urgentCount = deliveries.filter(d => d.isUrgent).length
  const oneRailCount = deliveries.filter(d => d.source === 'OneRail').length
  const avgPay = deliveries.length ? deliveries.reduce((s, d) => s + d.driverPayout, 0) / deliveries.length : 0
  const boxTruckCount = deliveries.filter(d => d.vehicleType === 'box-truck').length

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Live Load Board</h1>
            <p className="text-slate-400 mt-1">Real-time deliveries — loads expire when claimed</p>
          </div>
          <div className="flex items-center gap-3">
            <ShareModal />
            <Button onClick={handleRefresh} variant="outline"
              className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 gap-2">
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Scan Now
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[
            { icon: Package, label: 'Available', value: availableCount, cls: 'text-orange-400' },
            { icon: Zap, label: 'Urgent', value: urgentCount, cls: 'text-red-400' },
            { icon: TrendingUp, label: 'Avg Driver Pay', value: formatCurrency(avgPay), cls: 'text-emerald-400' },
            { icon: Shield, label: '⚡ One Rail', value: oneRailCount, cls: 'text-blue-400' },
            { icon: Truck, label: 'Box Trucks', value: boxTruckCount, cls: 'text-purple-400' },
          ].map(({ icon: Icon, label, value, cls }) => (
            <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
              <Icon className={`h-4 w-4 mx-auto mb-1 ${cls}`} />
              <p className={`font-bold text-lg ${cls}`}>{value}</p>
              <p className="text-slate-500 text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="City, description, company..."
                className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
            </div>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="SC">South Carolina</SelectItem>
                <SelectItem value="NC">North Carolina</SelectItem>
                <SelectItem value="GA">Georgia</SelectItem>
              </SelectContent>
            </Select>
            <Select value={vehicleFilter} onValueChange={v => setVehicleFilter(v as VehicleFilter)}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="All Vehicles" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Vehicles</SelectItem>
                <SelectItem value="cargo-van">Cargo Van</SelectItem>
                <SelectItem value="sprinter-van">Sprinter Van</SelectItem>
                <SelectItem value="box-truck">Box Truck</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={v => setSortBy(v as SortOption)}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="highest-pay">Highest Driver Pay</SelectItem>
                <SelectItem value="closest">Shortest Distance</SelectItem>
                <SelectItem value="urgent">Urgent First</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Source filter pills */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              { val: 'all', label: 'All Sources' },
              { val: 'OneRail', label: '⚡ One Rail Logistics' },
              { val: 'direct', label: 'Direct Shippers' },
              { val: 'posted', label: 'Posted Loads' },
            ].map(({ val, label }) => (
              <button key={val} onClick={() => setSourceFilter(val)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  sourceFilter === val
                    ? 'bg-orange-500 text-white border-orange-400'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
                }`}>
                {label}
              </button>
            ))}
            {expiredCount > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-500 border border-slate-700">
                {expiredCount} expired today
              </span>
            )}
          </div>
        </div>

        {/* Toast notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border shadow-2xl text-sm font-semibold ${
                notification.type === 'expire'
                  ? 'bg-slate-800 border-slate-600 text-slate-200'
                  : 'bg-emerald-900 border-emerald-600 text-emerald-200'
              }`}>
              {notification.type === 'expire'
                ? <Clock className="h-4 w-4 text-slate-400" />
                : <Bell className="h-4 w-4 text-emerald-400 animate-bounce" />
              }
              {notification.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-400 text-sm">
            Showing <span className="text-white font-semibold">{filtered.length}</span> active loads
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className={`w-2 h-2 rounded-full bg-emerald-500 ${scanPulse ? 'animate-pulse' : ''}`} />
            Live scanning
          </div>
        </div>

        {/* Load cards */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-3/4 mb-3" />
                <div className="h-3 bg-slate-800 rounded w-1/2 mb-2" />
                <div className="h-3 bg-slate-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search className="h-12 w-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-semibold">No loads match your filters</p>
            <p className="text-slate-600 text-sm mt-2">New loads arrive every 35 seconds</p>
            <Button onClick={() => { setSearch(''); setStateFilter('all'); setVehicleFilter('all'); setSourceFilter('all') }}
              className="mt-4 bg-orange-500 hover:bg-orange-400 text-white">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnimatePresence initial={false}>
              {filtered.map(delivery => {
                const { text: expText, urgent: expUrgent } = expiryLabel(delivery)
                const srcBadge = delivery.source ? SOURCE_BADGE[delivery.source] : null
                return (
                  <motion.div key={delivery.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3 }}>
                    {/* Source & expiry banner */}
                    {(srcBadge || expText) && (
                      <div className="flex items-center justify-between mb-1 px-1">
                        {srcBadge
                          ? <Badge className={`text-xs ${srcBadge.cls}`}>{srcBadge.label}</Badge>
                          : <span />
                        }
                        <span className={`text-xs font-semibold flex items-center gap-1 ${expUrgent ? 'text-red-400 animate-pulse' : 'text-slate-500'}`}>
                          <Clock className="h-3 w-3" />
                          {expText}
                        </span>
                      </div>
                    )}
                    <DeliveryCard delivery={delivery} isNew={newDeliveryIds.has(delivery.id)} />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-center gap-3 mt-10 text-xs text-slate-600">
          <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${scanPulse ? 'animate-pulse' : ''}`} />
          <span>Auto-scanning every 35s · Loads expire when claimed · Board shows live available loads only</span>
        </div>
      </div>
    </div>
  )
}
