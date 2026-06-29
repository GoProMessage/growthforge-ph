"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Delivery } from "@/types"
import { formatCurrency, estimateDriveTime, formatTime12h } from "@/lib/calculator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, RefreshCw, Truck, Clock, DollarSign, Package, ArrowRight, Zap, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const VEHICLE_BADGE: Record<string, string> = {
  'sprinter-van': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'cargo-van':    'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'box-truck':    'bg-amber-500/20 text-amber-300 border-amber-500/30',
}
const VEHICLE_LABEL: Record<string, string> = {
  'sprinter-van': 'Sprinter Van',
  'cargo-van':    'Cargo Van',
  'box-truck':    'Box Truck',
}

interface DeliveryCardProps {
  delivery: Delivery
  isNew?: boolean
}

export function DeliveryCard({ delivery, isNew }: DeliveryCardProps) {
  const driveTime = estimateDriveTime(delivery.distance)
  const isOneRail = delivery.source === 'OneRail'

  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: -20, scale: 0.98 } : { opacity: 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className={`bg-slate-900 border-slate-800 hover:border-orange-500/50 transition-all duration-200 overflow-hidden group ${
        isNew ? 'ring-2 ring-emerald-500/50' : ''
      } ${isOneRail ? 'border-blue-500/30' : ''}`}>
        {isNew && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-1.5 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-400 font-semibold">NEW OPPORTUNITY</span>
          </div>
        )}
        {isOneRail && !isNew && (
          <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-1.5 flex items-center gap-2">
            <Zap className="h-3 w-3 text-blue-400" />
            <span className="text-xs text-blue-400 font-semibold">ONE RAIL LOGISTICS PARTNER</span>
          </div>
        )}

        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge className={`text-xs font-semibold ${VEHICLE_BADGE[delivery.vehicleType] ?? 'bg-slate-700 text-slate-300'}`}>
                  <Truck className="h-3 w-3 mr-1" />
                  {VEHICLE_LABEL[delivery.vehicleType] ?? delivery.vehicleType}
                </Badge>
                {delivery.isUrgent && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs font-semibold">
                    <Zap className="h-3 w-3 mr-1" />URGENT
                  </Badge>
                )}
                {delivery.isScheduled && (
                  <Badge className="bg-orange-500/15 text-orange-400 border-orange-500/25 text-xs gap-1">
                    <RefreshCw className="h-3 w-3" />Recurring
                  </Badge>
                )}
              </div>
              <p className="text-slate-400 text-xs mt-1">
                {delivery.shipperCompany || delivery.shipperName} · Posted {formatDistanceToNow(delivery.postedAt, { addSuffix: true })}
              </p>
            </div>
            {/* Pay — shows driver payout prominently */}
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-orange-400">{formatCurrency(delivery.driverPayout)}</div>
              <div className="text-xs text-slate-500">driver pay · ${delivery.mileageRate}/mi</div>
            </div>
          </div>

          {/* Route */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2">
                <div className="flex flex-col items-center gap-1 mt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30 shrink-0" />
                  <div className="w-0.5 h-6 bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-500/30 shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-2">
                    <p className="text-white font-medium text-sm truncate">{delivery.pickup.city}, {delivery.pickup.state}</p>
                    <p className="text-slate-500 text-xs truncate">{delivery.pickup.address}</p>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm truncate">{delivery.dropoff.city}, {delivery.dropoff.state}</p>
                    <p className="text-slate-500 text-xs truncate">{delivery.dropoff.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-slate-800/50 rounded-lg">
            <div className="text-center">
              <div className="text-white font-semibold text-sm">{delivery.distance} mi</div>
              <div className="text-slate-500 text-xs">Distance</div>
            </div>
            <div className="text-center border-x border-slate-700">
              <div className="text-white font-semibold text-sm">{driveTime}</div>
              <div className="text-slate-500 text-xs">Drive Time</div>
            </div>
            <div className="text-center">
              <div className="text-white font-semibold text-sm">{delivery.weight || 'N/A'}</div>
              <div className="text-slate-500 text-xs">Weight</div>
            </div>
          </div>

          {/* Pickup/Delivery Times */}
          <div className="flex items-center gap-4 mb-4 text-xs text-slate-400 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-500" />
              <span>Pickup: <span className="text-white font-medium">{delivery.pickupDate} @ {formatTime12h(delivery.pickupTime)}</span></span>
            </div>
            <ArrowRight className="h-3 w-3 text-slate-600" />
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-red-500" />
              <span>Deliver: <span className="text-white font-medium">{delivery.deliveryDate} @ {formatTime12h(delivery.deliveryTime)}</span></span>
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-400 text-xs mb-3 line-clamp-1">{delivery.description}</p>

          {/* Features + Platform fee note */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {delivery.liftGate && <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-xs">Lift Gate</Badge>}
              {delivery.loadingDock && <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-xs">Loading Dock</Badge>}
            </div>
            <span className="text-slate-600 text-xs">
              Total: {formatCurrency(delivery.totalCost)} · Platform: 5%
            </span>
          </div>

          {/* Action */}
          <Link href={`/opportunities/${delivery.id}`}>
            <Button className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold gap-2 group-hover:bg-orange-400 transition-colors">
              View Details & GPS Directions
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}
