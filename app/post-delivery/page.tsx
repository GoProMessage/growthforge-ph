"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { CITIES, getCitiesByState } from "@/lib/cities"
import { haversineDistance, calculateCost, formatCurrency, estimateDriveTime } from "@/lib/calculator"
import { formatTime12h } from "@/lib/calculator"
import { VehicleType } from "@/types"
import {
  Truck, MapPin, Calendar, Clock, Package, DollarSign,
  CheckCircle, ArrowRight, Zap, Users, Info
} from "lucide-react"
import Link from "next/link"

interface FormData {
  shipperName: string
  shipperCompany: string
  shipperEmail: string
  shipperPhone: string
  vehicleType: VehicleType | ''
  pickupState: string
  pickupCity: string
  pickupAddress: string
  pickupZip: string
  pickupDate: string
  pickupTime: string
  dropoffState: string
  dropoffCity: string
  dropoffAddress: string
  dropoffZip: string
  deliveryDate: string
  deliveryTime: string
  description: string
  weight: string
  dimensions: string
  specialInstructions: string
  isScheduled: boolean
  frequency: string
  recurDays: string[]
  isUrgent: boolean
  liftGate: boolean
  loadingDock: boolean
}

const INITIAL: FormData = {
  shipperName: '', shipperCompany: '', shipperEmail: '', shipperPhone: '',
  vehicleType: '', pickupState: '', pickupCity: '', pickupAddress: '', pickupZip: '',
  pickupDate: '', pickupTime: '09:00', dropoffState: '', dropoffCity: '',
  dropoffAddress: '', dropoffZip: '', deliveryDate: '', deliveryTime: '17:00',
  description: '', weight: '', dimensions: '', specialInstructions: '',
  isScheduled: false, frequency: 'weekly', recurDays: ['mon','wed','fri'], isUrgent: false, liftGate: false, loadingDock: false,
}


// ── 12-hour Time Picker ────────────────────────────────────────────────────
function TimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  // value is always "HH:MM" (24h), we display as 12h
  const [h, m] = value.split(':').map(Number)
  const isPM = h >= 12
  const hour12 = h % 12 || 12

  function update(newHour12: number, newMinute: number, newIsPM: boolean) {
    let h24 = newHour12 % 12
    if (newIsPM) h24 += 12
    onChange(`${String(h24).padStart(2,'0')}:${String(newMinute).padStart(2,'0')}`)
  }

  return (
    <div className="flex items-center gap-1.5">
      {/* Hour */}
      <select
        value={hour12}
        onChange={e => update(Number(e.target.value), m, isPM)}
        className="bg-slate-800 border border-slate-700 text-white rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map(hr => (
          <option key={hr} value={hr}>{hr}</option>
        ))}
      </select>
      <span className="text-slate-500 font-bold">:</span>
      {/* Minutes */}
      <select
        value={m}
        onChange={e => update(hour12, Number(e.target.value), isPM)}
        className="bg-slate-800 border border-slate-700 text-white rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
      >
        {['00','15','30','45'].map(min => (
          <option key={min} value={Number(min)}>{min}</option>
        ))}
      </select>
      {/* AM / PM */}
      <div className="flex rounded-md overflow-hidden border border-slate-700">
        {(['AM','PM'] as const).map(period => (
          <button
            key={period}
            type="button"
            onClick={() => update(hour12, m, period === 'PM')}
            className={`px-3 py-2 text-sm font-bold transition-colors ${
              (period === 'AM' && !isPM) || (period === 'PM' && isPM)
                ? 'bg-orange-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function PostDeliveryPage() {
  const [form, setForm] = useState<FormData>(INITIAL)
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  const set = (k: keyof FormData, v: any) => setForm(f => ({ ...f, [k]: v }))

  // Calculate cost preview
  const pickupCityData = CITIES.find(c => c.name === form.pickupCity && c.state === form.pickupState)
  const dropoffCityData = CITIES.find(c => c.name === form.dropoffCity && c.state === form.dropoffState)
  const distance = (pickupCityData && dropoffCityData)
    ? haversineDistance(pickupCityData.lat, pickupCityData.lng, dropoffCityData.lat, dropoffCityData.lng)
    : 0
  const costs = (form.vehicleType && distance > 0)
    ? calculateCost(distance, form.vehicleType as VehicleType)
    : null

  const pickupCities = form.pickupState ? getCitiesByState(form.pickupState) : []
  const dropoffCities = form.dropoffState ? getCitiesByState(form.dropoffState) : []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6 ring-4 ring-emerald-500/30">
            <CheckCircle className="h-10 w-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-3">Delivery Posted!</h2>
          <p className="text-slate-400 mb-2">Your delivery has been published to the Live Board.</p>
          <p className="text-slate-400 mb-8">Drivers in <span className="text-white font-medium">{form.pickupCity}, {form.pickupState}</span> are being notified now.</p>
          {costs && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 text-left">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400">Estimated Cost</span>
                <span className="text-orange-400 font-extrabold text-2xl">{formatCurrency(costs.totalCost)}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-800/60 rounded-lg p-2">
                  <p className="text-white font-semibold text-sm">{distance} mi</p>
                  <p className="text-slate-600 text-xs">Distance</p>
                </div>
                <div className="bg-slate-800/60 rounded-lg p-2">
                  <p className="text-white font-semibold text-sm">{estimateDriveTime(distance)}</p>
                  <p className="text-slate-600 text-xs">Drive Time</p>
                </div>
                <div className="bg-slate-800/60 rounded-lg p-2">
                  <p className="text-white font-semibold text-sm">${(costs.mileageRate)}/mi</p>
                  <p className="text-slate-600 text-xs">Rate</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/opportunities" className="flex-1">
              <Button className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2">
                View Live Board
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="flex-1 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
              onClick={() => { setSubmitted(false); setForm(INITIAL); setStep(1) }}
            >
              Post Another
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mb-4">For Shippers</Badge>
          <h1 className="text-4xl font-extrabold text-white mb-3">Post a Delivery</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">Fill out your delivery details and connect with available drivers across SC, NC & GA instantly.</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= s ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-500'
              }`}>{s}</div>
              <span className={`text-sm font-medium hidden sm:block ${step === s ? 'text-white' : 'text-slate-600'}`}>
                {s === 1 ? 'Your Info' : s === 2 ? 'Delivery Details' : 'Schedule & Review'}
              </span>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-orange-500' : 'bg-slate-800'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

              {/* Step 1: Shipper Info */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Users className="h-5 w-5 text-orange-500" />
                        Your Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-slate-300">Full Name *</Label>
                          <Input value={form.shipperName} onChange={e => set('shipperName', e.target.value)}
                            placeholder="John Smith" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" required />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-slate-300">Company (optional)</Label>
                          <Input value={form.shipperCompany} onChange={e => set('shipperCompany', e.target.value)}
                            placeholder="ABC Company LLC" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-slate-300">Email *</Label>
                          <Input type="email" value={form.shipperEmail} onChange={e => set('shipperEmail', e.target.value)}
                            placeholder="you@company.com" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" required />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-slate-300">Phone *</Label>
                          <Input type="tel" value={form.shipperPhone} onChange={e => set('shipperPhone', e.target.value)}
                            placeholder="704-555-0100" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" required />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-slate-300">Vehicle Type Required *</Label>
                        <Select onValueChange={v => set('vehicleType', v)}>
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-300">
                            <SelectValue placeholder="Select vehicle type..." />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-700">
                            <SelectItem value="cargo-van" className="text-slate-300">🚐 Cargo Van (up to 1,500 lbs · $35 base + $1.25/mi)</SelectItem>
                            <SelectItem value="sprinter-van" className="text-slate-300">🚌 Sprinter Van (up to 3,000 lbs · $55 base + $1.75/mi)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="flex justify-end mt-4">
                    <Button type="button" onClick={() => setStep(2)} className="bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2"
                      disabled={!form.shipperName || !form.shipperEmail || !form.vehicleType}>
                      Continue <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Locations */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                  {/* Pickup */}
                  <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-emerald-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        Pickup Location
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-slate-300">State *</Label>
                          <Select onValueChange={v => { set('pickupState', v); set('pickupCity', '') }}>
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-300">
                              <SelectValue placeholder="Select state..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                              <SelectItem value="SC" className="text-slate-300">South Carolina</SelectItem>
                              <SelectItem value="NC" className="text-slate-300">North Carolina</SelectItem>
                              <SelectItem value="GA" className="text-slate-300">Georgia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-slate-300">City *</Label>
                          <Select onValueChange={v => set('pickupCity', v)} disabled={!form.pickupState}>
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-300">
                              <SelectValue placeholder={form.pickupState ? 'Select city...' : 'Select state first'} />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                              {pickupCities.map(c => <SelectItem key={c.name} value={c.name} className="text-slate-300">{c.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-1.5">
                          <Label className="text-slate-300">Street Address *</Label>
                          <Input value={form.pickupAddress} onChange={e => set('pickupAddress', e.target.value)}
                            placeholder="123 Commerce Dr" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" required />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-slate-300">ZIP Code</Label>
                          <Input value={form.pickupZip} onChange={e => set('pickupZip', e.target.value)}
                            placeholder="28201" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" maxLength={5} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dropoff */}
                  <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-red-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        Delivery Location
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-slate-300">State *</Label>
                          <Select onValueChange={v => { set('dropoffState', v); set('dropoffCity', '') }}>
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-300">
                              <SelectValue placeholder="Select state..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                              <SelectItem value="SC" className="text-slate-300">South Carolina</SelectItem>
                              <SelectItem value="NC" className="text-slate-300">North Carolina</SelectItem>
                              <SelectItem value="GA" className="text-slate-300">Georgia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-slate-300">City *</Label>
                          <Select onValueChange={v => set('dropoffCity', v)} disabled={!form.dropoffState}>
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-300">
                              <SelectValue placeholder={form.dropoffState ? 'Select city...' : 'Select state first'} />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                              {dropoffCities.map(c => <SelectItem key={c.name} value={c.name} className="text-slate-300">{c.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-1.5">
                          <Label className="text-slate-300">Street Address *</Label>
                          <Input value={form.dropoffAddress} onChange={e => set('dropoffAddress', e.target.value)}
                            placeholder="456 Business Blvd" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" required />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-slate-300">ZIP Code</Label>
                          <Input value={form.dropoffZip} onChange={e => set('dropoffZip', e.target.value)}
                            placeholder="27601" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" maxLength={5} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between mt-4">
                    <Button type="button" onClick={() => setStep(1)} variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">Back</Button>
                    <Button type="button" onClick={() => setStep(3)} className="bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2"
                      disabled={!form.pickupCity || !form.dropoffCity || !form.pickupAddress || !form.dropoffAddress}>
                      Continue <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Schedule + Details */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-orange-500" />
                        Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-slate-300">Pickup Date *</Label>
                          <Input type="date" value={form.pickupDate} onChange={e => set('pickupDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="bg-slate-800 border-slate-700 text-white" required />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-slate-300">Pickup Time *</Label>
                          <TimePicker value={form.pickupTime} onChange={v => set('pickupTime', v)} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-slate-300">Delivery Date *</Label>
                          <Input type="date" value={form.deliveryDate} onChange={e => set('deliveryDate', e.target.value)}
                            min={form.pickupDate || new Date().toISOString().split('T')[0]}
                            className="bg-slate-800 border-slate-700 text-white" required />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-slate-300">Delivery Time *</Label>
                          <TimePicker value={form.deliveryTime} onChange={v => set('deliveryTime', v)} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-slate-300 text-sm font-medium">Recurring Route</p>
                              <p className="text-slate-600 text-xs">Repeat this delivery on a schedule</p>
                            </div>
                            <Switch checked={form.isScheduled} onCheckedChange={v => set('isScheduled', v)} className="data-[state=checked]:bg-orange-500" />
                          </div>
                          {form.isScheduled && (
                            <div className="space-y-3 pt-3 border-t border-slate-700">
                              {/* Frequency picker */}
                              <div>
                                <p className="text-slate-400 text-xs mb-2 font-medium">Frequency</p>
                                <div className="grid grid-cols-4 gap-1.5">
                                  {[
                                    { val: 'daily',    label: 'Daily' },
                                    { val: 'weekly',   label: 'Weekly' },
                                    { val: 'biweekly', label: 'Bi-Weekly' },
                                    { val: 'monthly',  label: 'Monthly' },
                                  ].map(({ val, label }) => (
                                    <button
                                      key={val}
                                      type="button"
                                      onClick={() => set('frequency', val)}
                                      className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                        form.frequency === val
                                          ? 'bg-orange-500 text-white'
                                          : 'bg-slate-700 text-slate-400 hover:text-white'
                                      }`}
                                    >
                                      {label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              {/* Day picker (weekly / biweekly) */}
                              {(form.frequency === 'weekly' || form.frequency === 'biweekly') && (
                                <div>
                                  <p className="text-slate-400 text-xs mb-2 font-medium">Run on</p>
                                  <div className="flex gap-1.5 flex-wrap">
                                    {(['mon','tue','wed','thu','fri','sat','sun'] as const).map(day => {
                                      const active = form.recurDays.includes(day)
                                      return (
                                        <button
                                          key={day}
                                          type="button"
                                          onClick={() => {
                                            const next = active
                                              ? form.recurDays.filter((d: string) => d !== day)
                                              : [...form.recurDays, day]
                                            set('recurDays', next)
                                          }}
                                          className={`w-9 h-9 rounded-full text-xs font-bold uppercase transition-colors ${
                                            active
                                              ? 'bg-orange-500 text-white'
                                              : 'bg-slate-700 text-slate-400 hover:text-white'
                                          }`}
                                        >
                                          {day.slice(0,2)}
                                        </button>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}
                              <p className="text-emerald-400 text-xs flex items-center gap-1.5">
                                <span>✓</span>
                                Auto-posts to Live Board 2 hrs before each pickup
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                          <div>
                            <p className="text-slate-300 text-sm font-medium">Urgent Delivery</p>
                            <p className="text-slate-600 text-xs">Priority listing</p>
                          </div>
                          <Switch checked={form.isUrgent} onCheckedChange={v => set('isUrgent', v)} className="data-[state=checked]:bg-red-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Package className="h-5 w-5 text-orange-500" />
                        Cargo Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-slate-300">Description *</Label>
                        <Textarea value={form.description} onChange={e => set('description', e.target.value)}
                          placeholder="Describe the items: e.g., Living room furniture set — sofa, loveseat, coffee table..."
                          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[80px]" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-slate-300">Estimated Weight</Label>
                          <Input value={form.weight} onChange={e => set('weight', e.target.value)}
                            placeholder="e.g., 500 lbs" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-slate-300">Dimensions</Label>
                          <Input value={form.dimensions} onChange={e => set('dimensions', e.target.value)}
                            placeholder="e.g., 8'×4'×4'" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                          <p className="text-slate-300 text-sm font-medium">Lift Gate Needed</p>
                          <Switch checked={form.liftGate} onCheckedChange={v => set('liftGate', v)} className="data-[state=checked]:bg-orange-500" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                          <p className="text-slate-300 text-sm font-medium">Loading Dock</p>
                          <Switch checked={form.loadingDock} onCheckedChange={v => set('loadingDock', v)} className="data-[state=checked]:bg-orange-500" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-slate-300">Special Instructions</Label>
                        <Textarea value={form.specialInstructions} onChange={e => set('specialInstructions', e.target.value)}
                          placeholder="Any additional notes for the driver..."
                          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[60px]" />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button type="button" onClick={() => setStep(2)} variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">Back</Button>
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2 h-12 px-8">
                      Post Delivery Live
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Cost Preview Sidebar */}
            <div className="space-y-5">
              <Card className="bg-slate-900 border-slate-800 sticky top-24">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-orange-500" />
                    Cost Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {costs && distance > 0 ? (
                    <>
                      <div className="text-center py-3">
                        <p className="text-5xl font-extrabold text-orange-400">{formatCurrency(costs.totalCost)}</p>
                        <p className="text-slate-500 text-sm mt-1">Estimated driver payout</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        {[
                          { label: 'Base Fee', val: formatCurrency(costs.baseFee) },
                          { label: `${distance} mi × $${costs.mileageRate}`, val: formatCurrency(costs.mileageCost) },
                          { label: 'Drive Time', val: estimateDriveTime(distance) },
                        ].map(({ label, val }) => (
                          <div key={label} className="flex justify-between">
                            <span className="text-slate-500">{label}</span>
                            <span className="text-slate-300 font-medium">{val}</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <p className="text-emerald-400 text-xs font-medium">✓ Drivers see this rate before accepting</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <MapPin className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                      <p className="text-slate-500 text-sm">Select pickup & delivery cities to see cost estimate</p>
                    </div>
                  )}

                  <Separator className="bg-slate-800" />

                  <div className="space-y-2 text-xs text-slate-500">
                    <div className="flex items-start gap-2">
                      <Info className="h-3.5 w-3.5 text-slate-600 mt-0.5 shrink-0" />
                      <span>Platform fee of 5% added at checkout</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Info className="h-3.5 w-3.5 text-slate-600 mt-0.5 shrink-0" />
                      <span>Payment collected after driver accepts</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Info className="h-3.5 w-3.5 text-slate-600 mt-0.5 shrink-0" />
                      <span>Cargo Van: $35 base + $1.25/mi</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Info className="h-3.5 w-3.5 text-slate-600 mt-0.5 shrink-0" />
                      <span>Sprinter Van: $55 base + $1.75/mi</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
