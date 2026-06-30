"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Star, Phone, Truck, CheckCircle, Clock, MapPin,
  Shield, MessageSquare, Navigation, Package,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface DriverProfileData {
  name: string
  initials: string
  rating: number
  deliveries: number
  vehicle: string        // "2022 Mercedes Sprinter 2500"
  color: string          // "White"
  plate: string          // "SC 4X9-2B1"
  vehicleType: string    // "Sprinter Van"
  phone: string
  status: 'en-route' | 'arrived' | 'loading' | 'delivered'
  etaMinutes?: number    // only when en-route
  city: string
}

const STATUS_CONFIG = {
  'en-route':  { label: 'En Route',       cls: 'bg-blue-500/20 text-blue-300 border-blue-500/30',    dot: 'bg-blue-500 animate-pulse' },
  'arrived':   { label: 'Arrived',         cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-500' },
  'loading':   { label: 'Loading Cargo',   cls: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',    dot: 'bg-yellow-500 animate-pulse' },
  'delivered': { label: 'Delivered ✓',     cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-500' },
}

const VEHICLE_ICON: Record<string, string> = {
  'Cargo Van': '🚐', 'Sprinter Van': '🚌', 'Box Truck': '🚛',
}

interface DriverProfileCardProps {
  driver: DriverProfileData
  showFull?: boolean     // true = shipper detail view; false = compact inline
}

export function DriverProfileCard({ driver, showFull = true }: DriverProfileCardProps) {
  const [called, setCalled] = useState(false)
  const status = STATUS_CONFIG[driver.status]

  if (!showFull) {
    // ── Compact inline version ────────────────────────────────────────
    return (
      <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700 rounded-xl p-3">
        <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-sm shrink-0">
          {driver.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">{driver.name}</p>
          <p className="text-slate-400 text-xs truncate">{driver.vehicle} · {driver.color} · {driver.plate}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className={`w-2 h-2 rounded-full ${status.dot}`} />
          <span className="text-xs text-slate-400">{status.label}</span>
        </div>
      </div>
    )
  }

  // ── Full shipper-facing card ───────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

      {/* Status bar */}
      <div className={`px-5 py-2.5 border-b border-slate-800 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status.dot}`} />
          <span className="text-sm font-semibold text-slate-200">{status.label}</span>
          {driver.status === 'en-route' && driver.etaMinutes && (
            <span className="text-slate-400 text-sm">· Est. arrival <strong className="text-white">{driver.etaMinutes} min</strong></span>
          )}
        </div>
        <Badge className={`text-xs ${status.cls}`}>{status.label}</Badge>
      </div>

      <div className="p-5 space-y-5">
        {/* Driver identity */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-orange-500/20 border-2 border-orange-500/30 flex items-center justify-center text-orange-400 font-extrabold text-xl">
              {driver.initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
              <CheckCircle className="h-3 w-3 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-white font-bold text-lg">{driver.name}</h3>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                <Shield className="h-3 w-3 mr-1" />Verified
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(n => (
                  <Star key={n} className={`h-3.5 w-3.5 ${n <= Math.floor(driver.rating) ? 'text-orange-400 fill-orange-400' : 'text-slate-700'}`} />
                ))}
                <span className="text-white font-semibold text-sm ml-1">{driver.rating}</span>
              </div>
              <span className="text-slate-500 text-xs">·</span>
              <span className="text-slate-400 text-xs">{driver.deliveries} deliveries</span>
            </div>
          </div>
        </div>

        {/* Vehicle — the most important thing for shippers */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Vehicle Info</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{VEHICLE_ICON[driver.vehicleType] ?? '🚐'}</span>
            <div className="flex-1">
              <p className="text-white font-bold">{driver.vehicle}</p>
              <p className="text-slate-400 text-sm mt-0.5">
                {driver.color} · <span className="font-mono font-semibold text-white">{driver.plate}</span>
              </p>
            </div>
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">{driver.vehicleType}</Badge>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
          <span>Currently in <strong className="text-white">{driver.city}</strong></span>
          {driver.status === 'en-route' && driver.etaMinutes && (
            <>
              <Navigation className="h-4 w-4 text-blue-400 ml-2" />
              <span className="text-blue-400 font-medium">Headed to pickup</span>
            </>
          )}
        </div>

        {/* Contact actions */}
        <div className="grid grid-cols-2 gap-3">
          <a href={`tel:${driver.phone}`} onClick={() => setCalled(true)}
            className="flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 rounded-xl h-11 text-sm font-semibold transition-colors">
            <Phone className="h-4 w-4" />
            {called ? 'Calling...' : 'Call Driver'}
          </a>
          <a href={`sms:${driver.phone}`}
            className="flex items-center justify-center gap-2 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-300 rounded-xl h-11 text-sm font-semibold transition-colors">
            <MessageSquare className="h-4 w-4" />
            Text Driver
          </a>
        </div>

        {/* What to have ready */}
        <div className="border-t border-slate-800 pt-4">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Have Ready at Pickup</p>
          <div className="space-y-2">
            {[
              { icon: Package, text: "Cargo ready to load — no waiting" },
              { icon: CheckCircle, text: "Confirm pickup on your shipper app" },
              { icon: Shield, text: "Verify driver name matches: " + driver.name },
              { icon: Truck, text: "Check plate: " + driver.plate },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-xs text-slate-400">
                <Icon className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
