"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { MOCK_DRIVERS } from "@/lib/mock-data"
import { formatCurrency, estimateDriveTime, VEHICLE_LABELS } from "@/lib/calculator"
import { DriverProfileCard, DriverProfileData } from "@/components/driver-profile-card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { claimLoad, isLoadClaimed } from "@/lib/claimed-store"
import { formatTime12h } from "@/lib/calculator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Truck, MapPin, Clock, DollarSign, Package, Phone, Calendar,
  ArrowLeft, ArrowRight, Zap, CheckCircle, Shield, User, Mail, CreditCard,
  Navigation, AlertCircle, Star, Percent,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

const MapDirections = dynamic(
  () => import('@/components/map-directions').then(m => ({ default: m.MapDirections })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[380px] bg-slate-800/50 rounded-xl border border-slate-700 flex items-center justify-center animate-pulse">
        <div className="text-center">
          <Navigation className="h-8 w-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">Loading map...</p>
        </div>
      </div>
    )
  }
)

const VEHICLE_BADGE: Record<string, string> = {
  'sprinter-van': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'cargo-van':    'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'box-truck':    'bg-amber-500/20 text-amber-300 border-amber-500/30',
}

// Build a mock driver profile from MOCK_DRIVERS[0]
function buildDriverProfile(): DriverProfileData {
  const d = MOCK_DRIVERS[0]
  return {
    name: d.name,
    initials: d.name.split(' ').map(n => n[0]).join(''),
    rating: d.rating,
    deliveries: d.completedDeliveries,
    vehicle: `${d.vehicleYear} ${d.vehicleMake} ${d.vehicleModel}`,
    color: 'White',
    plate: d.licensePlate,
    vehicleType: VEHICLE_LABELS[d.vehicleType],
    phone: d.phone,
    status: 'en-route',
    etaMinutes: 14,
    city: d.currentCity,
  }
}

export default function DeliveryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [delivery, setDelivery] = useState<import("@/types").Delivery | null>(null)
  const [loadingDelivery, setLoadingDelivery] = useState(true)
  const [claimed, setClaimed] = useState(false)
  const [alreadyClaimed, setAlreadyClaimed] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  // Fetch delivery from API
  useEffect(() => {
    setLoadingDelivery(true)
    fetch(`/api/deliveries/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.delivery) {
          setDelivery({
            ...data.delivery,
            postedAt: new Date(data.delivery.postedAt),
            expiresAt: new Date(data.delivery.expiresAt),
          })
        }
      })
      .catch(err => console.error('Failed to load delivery:', err))
      .finally(() => setLoadingDelivery(false))
  }, [id])

  useEffect(() => {
    if (delivery && isLoadClaimed(delivery.id)) {
      setAlreadyClaimed(true)
      setClaimed(true)
    }
  }, [delivery?.id])

  if (loadingDelivery) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading load details...</p>
        </div>
      </div>
    )
  }

  if (!delivery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 text-xl">Delivery not found</p>
          <Link href="/opportunities">
            <Button className="mt-4 bg-orange-500 hover:bg-orange-400">Back to Board</Button>
          </Link>
        </div>
      </div>
    )
  }

  const driveTime = estimateDriveTime(delivery.distance)
  const vehicleLabel = VEHICLE_LABELS[delivery.vehicleType] ?? delivery.vehicleType
  const isOneRail = delivery.source === 'OneRail'

  return (
    <>
    <div className="min-h-screen bg-slate-950">
      {/* Back Nav */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-400 hover:text-white gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Board
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            {isOneRail && <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 gap-1"><Zap className="h-3 w-3" />One Rail Logistics</Badge>}
            {delivery.isUrgent && <Badge className="bg-red-500/20 text-red-400 border-red-500/30 gap-1"><Zap className="h-3 w-3" />URGENT</Badge>}
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Available</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Main Info ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title Card */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Badge className={`text-sm font-semibold ${VEHICLE_BADGE[delivery.vehicleType]}`}>
                        <Truck className="h-4 w-4 mr-1.5" />
                        {vehicleLabel} Required
                      </Badge>
                      {delivery.isScheduled && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          <Calendar className="h-3.5 w-3.5 mr-1" />Scheduled Delivery
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">
                      {delivery.pickup.city}, {delivery.pickup.state} → {delivery.dropoff.city}, {delivery.dropoff.state}
                    </h1>
                    <p className="text-slate-500 text-sm">
                      Posted by <span className="text-slate-300">{delivery.shipperCompany || delivery.shipperName}</span>
                      {' · '}{formatDistanceToNow(delivery.postedAt, { addSuffix: true })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-3xl font-extrabold text-orange-400">{formatCurrency(delivery.driverPayout)}</div>
                    <p className="text-slate-500 text-xs mt-1">Your payout (95%)</p>
                    <p className="text-slate-600 text-xs">Total: {formatCurrency(delivery.totalCost)}</p>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed">{delivery.description}</p>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-orange-500" />
                  Route & GPS Directions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <MapDirections
                  pickupLat={delivery.pickup.lat}
                  pickupLng={delivery.pickup.lng}
                  dropoffLat={delivery.dropoff.lat}
                  dropoffLng={delivery.dropoff.lng}
                  pickupCity={`${delivery.pickup.city}, ${delivery.pickup.state}`}
                  dropoffCity={`${delivery.dropoff.city}, ${delivery.dropoff.state}`}
                  distance={delivery.distance}
                />
              </CardContent>
            </Card>

            {/* Pickup + Dropoff */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-emerald-500">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" />
                    <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wide">Pickup</span>
                  </div>
                  <p className="text-white font-bold text-lg mb-1">{delivery.pickup.city}, {delivery.pickup.state}</p>
                  <p className="text-slate-400 text-sm mb-1">{delivery.pickup.address}</p>
                  <p className="text-slate-600 text-sm mb-4">{delivery.pickup.zip}</p>
                  <Separator className="bg-slate-800 mb-4" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-emerald-500" />
                      <span className="text-slate-300">{delivery.pickupDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-emerald-500" />
                      <span className="text-slate-300 font-semibold">{delivery.pickupTime}</span>
                    </div>
                    {delivery.loadingDock && <Badge className="bg-slate-800 text-slate-400 border-slate-700 text-xs">Loading Dock Available</Badge>}
                    {delivery.liftGate && <Badge className="bg-slate-800 text-slate-400 border-slate-700 text-xs">Lift Gate Required</Badge>}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-red-500">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-500/30" />
                    <span className="text-red-400 font-semibold text-sm uppercase tracking-wide">Delivery</span>
                  </div>
                  <p className="text-white font-bold text-lg mb-1">{delivery.dropoff.city}, {delivery.dropoff.state}</p>
                  <p className="text-slate-400 text-sm mb-1">{delivery.dropoff.address}</p>
                  <p className="text-slate-600 text-sm mb-4">{delivery.dropoff.zip}</p>
                  <Separator className="bg-slate-800 mb-4" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-red-500" />
                      <span className="text-slate-300">{delivery.deliveryDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-red-500" />
                      <span className="text-slate-300 font-semibold">{delivery.deliveryTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cargo Details */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-orange-500" />
                  Cargo Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Weight',        value: delivery.weight || 'Not specified' },
                    { label: 'Dimensions',    value: delivery.dimensions || 'Contact shipper' },
                    { label: 'Vehicle Type',  value: vehicleLabel },
                    { label: 'Lift Gate',     value: delivery.liftGate ? 'Required' : 'Not needed' },
                    { label: 'Loading Dock',  value: delivery.loadingDock ? 'Available' : 'Not available' },
                    { label: 'Delivery Type', value: delivery.isScheduled ? 'Scheduled' : 'On-Demand' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-slate-500 text-xs mb-1">{label}</p>
                      <p className="text-white text-sm font-medium">{value}</p>
                    </div>
                  ))}
                </div>
                {delivery.specialInstructions && (
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
                    <p className="text-yellow-300 text-sm">{delivery.specialInstructions}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Driver Profile — shown after claim (demo: toggle button) */}
            {claimed && (
              <Card className="bg-slate-900 border-slate-800 border border-blue-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-orange-500" />
                    Your Driver — On the Way
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <DriverProfileCard driver={buildDriverProfile()} showFull />
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── Right: Sidebar ──────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Pay Breakdown */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-orange-500" />
                  Pay Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {[
                  { label: 'Base Fee',                                               value: formatCurrency(delivery.baseFee) },
                  { label: `Mileage (${delivery.distance} mi × $${delivery.mileageRate}/mi)`, value: formatCurrency(delivery.mileageCost) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
                <Separator className="bg-slate-700" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Shipper Total</span>
                  <span className="text-white font-semibold">{formatCurrency(delivery.totalCost)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-1"><Percent className="h-3 w-3" />Platform fee (5%)</span>
                  <span className="text-slate-500">−{formatCurrency(delivery.platformFee)}</span>
                </div>
                <Separator className="bg-slate-700" />
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Your Payout</span>
                  <span className="text-orange-400 font-extrabold text-2xl">{formatCurrency(delivery.driverPayout)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span className="flex items-center gap-1"><CreditCard className="h-3 w-3" />Instant pay available</span>
                  <span>~30 min after drop-off</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <p className="text-white font-semibold text-sm">{delivery.distance} mi</p>
                    <p className="text-slate-500 text-xs">Distance</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <p className="text-white font-semibold text-sm">{driveTime}</p>
                    <p className="text-slate-500 text-xs">Drive Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipper Info */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-500" />
                  Shipper Info
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div>
                  <p className="text-white font-semibold">{delivery.shipperName}</p>
                  {delivery.shipperCompany && (
                    <p className="text-slate-400 text-sm flex items-center gap-1.5 mt-0.5">
                      {isOneRail && <Zap className="h-3 w-3 text-blue-400" />}
                      {delivery.shipperCompany}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < 4 ? 'text-orange-400 fill-orange-400' : 'text-slate-700'}`} />
                  ))}
                  <span className="text-slate-400 text-sm ml-1">4.8 rating</span>
                </div>
                {delivery.contactPhone && (
                  <a href={`tel:${delivery.contactPhone}`} className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors">
                    <Phone className="h-4 w-4" />
                    {delivery.contactPhone}
                  </a>
                )}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  Verified shipper · Payment secured
                </div>
              </CardContent>
            </Card>

            {/* CTA Buttons */}
            <div className="space-y-3">
              {alreadyClaimed && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center">
                  <p className="text-red-400 font-bold text-sm">⚠️ This load has already been claimed</p>
                </div>
              )}
              {!claimed ? (
                <>
                  <Button
                    onClick={async () => {
                        claimLoad(delivery.id)
                        setClaimed(true)
                        setAlreadyClaimed(true)
                        // Persist to Supabase
                        await fetch(`/api/deliveries/${delivery.id}/claim`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({}),
                        }).catch(() => {}) // silently fail — localStorage claim still works
                      }}
                    disabled={alreadyClaimed}
                    className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold h-12 text-base gap-2 disabled:opacity-50">
                    <CheckCircle className="h-5 w-5" />
                    Claim This Load — Free
                  </Button>
                </>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center space-y-2">
                  <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto" />
                  <p className="text-emerald-300 font-bold">Load Claimed!</p>
                  <p className="text-slate-400 text-xs">Driver profile shown to shipper. Payout sent after drop-off confirmation.</p>
                </div>
              )}
              <Button variant="outline"
                className="w-full border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 h-11 gap-2"
                onClick={() => setContactOpen(true)}>
                <Phone className="h-4 w-4" />
                Contact Shipper
              </Button>
              <a href={`https://www.google.com/maps/dir/?api=1&origin=${delivery.pickup.lat},${delivery.pickup.lng}&destination=${delivery.dropoff.lat},${delivery.dropoff.lng}&travelmode=driving`}
                target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 h-11 gap-2">
                  <Navigation className="h-4 w-4 text-blue-400" />
                  Open in Google Maps
                </Button>
              </a>
            </div>

            {/* Protection */}
            <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span className="text-slate-300 font-medium text-sm">Platform Protection</span>
              </div>
              <ul className="space-y-1.5 text-slate-500 text-xs">
                {[
                  'Shipper pays before pickup — funds held in escrow',
                  'Your payout released after delivery confirmed',
                  'Instant pay to debit card available',
                  'Dispute resolution if issues arise',
                  'Driver profile visible to shipper after claim',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Contact Shipper Dialog */}
    <Dialog open={contactOpen} onOpenChange={setContactOpen}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Phone className="h-5 w-5 text-orange-500" />
            Contact Shipper
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div>
            <p className="text-white font-semibold">{delivery.contactName ?? delivery.shipperName}</p>
            <p className="text-slate-400 text-sm">{delivery.shipperCompany}</p>
          </div>
          {delivery.contactPhone && (
            <>
              <a href={`tel:${delivery.contactPhone}`}
                className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 hover:bg-orange-500/20 transition-colors">
                <Phone className="h-5 w-5 text-orange-400 shrink-0" />
                <div>
                  <p className="text-orange-300 font-semibold text-sm">Tap to Call</p>
                  <p className="text-white font-mono">{delivery.contactPhone}</p>
                </div>
              </a>
              <a href={`sms:${delivery.contactPhone}`}
                className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg p-3 hover:bg-slate-700 transition-colors">
                <Mail className="h-5 w-5 text-slate-400 shrink-0" />
                <div>
                  <p className="text-slate-300 font-semibold text-sm">Send SMS</p>
                  <p className="text-slate-400 text-sm">{delivery.contactPhone}</p>
                </div>
              </a>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
