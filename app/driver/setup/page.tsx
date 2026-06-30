"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Truck, User, CreditCard, CheckCircle, ArrowRight, ArrowLeft,
  Phone, Mail, Camera, Star, Shield, Zap, Building2,
  DollarSign, Clock, AlertCircle, Lock, Upload, Eye, EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/calculator"

// ── Step definitions ───────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Personal Info",  icon: User      },
  { id: 2, label: "Vehicle",        icon: Truck     },
  { id: 3, label: "Get Paid",       icon: CreditCard },
]

type PayoutMethod = 'instant' | 'standard' | null

export default function DriverSetupPage() {
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>(null)
  const [showAcct, setShowAcct] = useState(false)

  // Form state
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    vehicleType: '', year: '', make: '', model: '', color: '', plate: '',
    // payout
    cardNumber: '', cardName: '', cardExpiry: '',
    bankRouting: '', bankAccount: '',
  })

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  const fmtCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const fmtExpiry = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d }

  function nextStep() { if (step < 3) setStep(s => s + 1) }
  function prevStep() { if (step > 1) setStep(s => s - 1) }

  function handleFinish() {
    // In production: POST to API to create Stripe Connect account
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <motion.div className="max-w-md w-full text-center space-y-6"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-2">
            <CheckCircle className="h-10 w-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">You&apos;re All Set!</h1>
          <p className="text-slate-400">
            Your driver profile is live. Shippers can now see your info when you claim a load.
            Payouts go to your connected account automatically after delivery confirmation.
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-left space-y-3">
            <p className="text-slate-300 font-semibold text-sm">What happens next:</p>
            {[
              { icon: Truck,       text: "Browse and claim loads on the Live Board" },
              { icon: CheckCircle, text: "Shipper sees your profile & vehicle details instantly" },
              { icon: DollarSign,  text: `Payout sent ${payoutMethod === 'instant' ? 'within 30 min of delivery confirmation' : 'within 1-2 business days'}` },
              { icon: Star,        text: "Build your rating — higher ratings = more load access" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-slate-400">
                <Icon className="h-4 w-4 text-emerald-400 shrink-0" />
                {text}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/opportunities">
              <Button className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold h-12 gap-2">
                Browse Live Loads
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/driver">
              <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:text-white">
                View My Driver Portal
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-lg mx-auto px-4 py-10">

        {/* Back */}
        <Link href="/driver" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Driver Portal
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold">Driver Setup</h1>
          <p className="text-slate-400 mt-2">Takes 3 minutes — complete to start earning</p>
        </div>

        {/* Step progress */}
        <div className="flex items-center justify-between mb-10 px-2">
          {STEPS.map((s, i) => {
            const active = step === s.id
            const done = step > s.id
            return (
              <div key={s.id} className="flex-1 flex flex-col items-center relative">
                {i > 0 && (
                  <div className={`absolute left-0 top-5 w-full h-0.5 -translate-x-1/2 ${done ? 'bg-orange-500' : 'bg-slate-800'}`} />
                )}
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all ${
                  done ? 'bg-orange-500 border-orange-500' : active ? 'bg-slate-800 border-orange-500' : 'bg-slate-900 border-slate-700'
                }`}>
                  {done
                    ? <CheckCircle className="h-5 w-5 text-white" />
                    : <s.icon className={`h-5 w-5 ${active ? 'text-orange-400' : 'text-slate-600'}`} />
                  }
                </div>
                <span className={`text-xs mt-2 font-medium ${active ? 'text-orange-400' : done ? 'text-slate-400' : 'text-slate-600'}`}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

            {/* ── STEP 1: Personal Info ─────────────────────────────── */}
            {step === 1 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 space-y-5">
                <div>
                  <h2 className="text-xl font-bold mb-1">Personal Information</h2>
                  <p className="text-slate-400 text-sm">This is what shippers and the platform see</p>
                </div>

                {/* Profile photo placeholder */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-orange-500/20 border-2 border-orange-500/30 border-dashed flex items-center justify-center text-orange-400 font-bold text-xl">
                    {form.firstName ? form.firstName[0].toUpperCase() : '?'}
                  </div>
                  <div>
                    <Button variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:text-white gap-2">
                      <Camera className="h-4 w-4" /> Upload Photo
                    </Button>
                    <p className="text-slate-600 text-xs mt-1">JPG or PNG — shown to shippers</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 text-xs font-medium mb-1 block">First Name *</label>
                    <Input value={form.firstName} onChange={e => set('firstName', e.target.value)}
                      placeholder="Marcus" className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs font-medium mb-1 block">Last Name *</label>
                    <Input value={form.lastName} onChange={e => set('lastName', e.target.value)}
                      placeholder="Carter" className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1 block">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="(803) 555-0100" className="pl-9 bg-slate-800 border-slate-700 text-white" />
                  </div>
                  <p className="text-slate-600 text-xs mt-1">Shown to shippers after you claim a load</p>
                </div>
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1 block">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input value={form.email} onChange={e => set('email', e.target.value)}
                      type="email" placeholder="driver@email.com" className="pl-9 bg-slate-800 border-slate-700 text-white" />
                  </div>
                </div>

                <Button onClick={nextStep}
                  disabled={!form.firstName || !form.lastName || !form.phone || !form.email}
                  className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold h-12 gap-2">
                  Continue to Vehicle Info
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* ── STEP 2: Vehicle ───────────────────────────────────── */}
            {step === 2 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 space-y-5">
                <div>
                  <h2 className="text-xl font-bold mb-1">Vehicle Information</h2>
                  <p className="text-slate-400 text-sm">Shippers see your vehicle details before pickup</p>
                </div>

                {/* Vehicle type selector */}
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-2 block">Vehicle Type *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 'cargo-van', label: 'Cargo Van', icon: '🚐', rate: '$1.25/mi' },
                      { val: 'sprinter-van', label: 'Sprinter Van', icon: '🚌', rate: '$1.75/mi' },
                      { val: 'box-truck', label: 'Box Truck', icon: '🚛', rate: '$2.25/mi' },
                    ].map(({ val, label, icon, rate }) => (
                      <button key={val} onClick={() => set('vehicleType', val)}
                        className={`rounded-xl border p-3 text-center transition-all ${
                          form.vehicleType === val
                            ? 'border-orange-500 bg-orange-500/10 text-white'
                            : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                        }`}>
                        <div className="text-2xl mb-1">{icon}</div>
                        <p className="text-xs font-semibold">{label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{rate}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 text-xs font-medium mb-1 block">Year *</label>
                    <Input value={form.year} onChange={e => set('year', e.target.value)}
                      placeholder="2022" maxLength={4} className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs font-medium mb-1 block">Make *</label>
                    <Input value={form.make} onChange={e => set('make', e.target.value)}
                      placeholder="Mercedes" className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs font-medium mb-1 block">Model *</label>
                    <Input value={form.model} onChange={e => set('model', e.target.value)}
                      placeholder="Sprinter 2500" className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs font-medium mb-1 block">Color *</label>
                    <Input value={form.color} onChange={e => set('color', e.target.value)}
                      placeholder="White" className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1 block">License Plate *</label>
                  <Input value={form.plate} onChange={e => set('plate', e.target.value.toUpperCase())}
                    placeholder="SC 4X9-2B1" className="bg-slate-800 border-slate-700 text-white font-mono" />
                </div>

                {/* Preview — what shipper sees */}
                {form.vehicleType && form.make && form.model && (
                  <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                    <p className="text-slate-500 text-xs mb-2 font-medium">SHIPPER PREVIEW</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
                        {form.firstName?.[0]}{form.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{form.firstName} {form.lastName}</p>
                        <p className="text-slate-400 text-xs">{form.year} {form.make} {form.model} · {form.color} · {form.plate || 'Plate TBD'}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={prevStep} variant="outline" className="border-slate-700 text-slate-400 hover:text-white h-12 px-6">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button onClick={nextStep}
                    disabled={!form.vehicleType || !form.year || !form.make || !form.model || !form.color || !form.plate}
                    className="flex-1 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold h-12 gap-2">
                    Continue to Payout Setup
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Get Paid ──────────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 space-y-5">
                  <div>
                    <h2 className="text-xl font-bold mb-1">Connect Your Payout</h2>
                    <p className="text-slate-400 text-sm">Choose how you want to get paid after each delivery</p>
                  </div>

                  {/* How it works */}
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                    <p className="text-orange-300 font-semibold text-sm mb-2">How Payouts Work</p>
                    <div className="space-y-2 text-sm text-slate-400">
                      <div className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold mt-0.5">1.</span>
                        Shipper pays the full amount online before pickup
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold mt-0.5">2.</span>
                        VanRoute Pro holds the payment securely in escrow
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold mt-0.5">3.</span>
                        You confirm delivery complete → <strong className="text-white">you receive 95%</strong>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold mt-0.5">4.</span>
                        Platform retains 5% service fee automatically
                      </div>
                    </div>
                  </div>

                  {/* Method selector */}
                  <div className="space-y-3">
                    <label className="text-slate-400 text-xs font-medium block">Choose Payout Method</label>

                    {/* Instant pay */}
                    <button onClick={() => setPayoutMethod('instant')}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${payoutMethod === 'instant' ? 'border-orange-500 bg-orange-500/10' : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-white font-bold">Instant Pay — Debit Card</p>
                            <p className="text-slate-400 text-xs mt-0.5">Paid within 30 min of delivery confirmation</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Recommended</Badge>
                          <p className="text-slate-500 text-xs mt-1">$0.50/transfer</p>
                        </div>
                      </div>
                    </button>

                    {/* Standard ACH */}
                    <button onClick={() => setPayoutMethod('standard')}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${payoutMethod === 'standard' ? 'border-orange-500 bg-orange-500/10' : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-white font-bold">Standard — Bank Account (ACH)</p>
                            <p className="text-slate-400 text-xs mt-0.5">1–2 business days after confirmation</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">Free</Badge>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Instant pay — debit card form */}
                  <AnimatePresence>
                    {payoutMethod === 'instant' && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="space-y-4 bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="h-4 w-4 text-emerald-400" />
                          <p className="text-emerald-400 text-xs font-semibold">256-bit encrypted · Powered by Stripe</p>
                        </div>
                        <div>
                          <label className="text-slate-400 text-xs font-medium mb-1 block">Debit Card Number</label>
                          <Input value={fmtCard(form.cardNumber)}
                            onChange={e => set('cardNumber', e.target.value.replace(/\s/g,''))}
                            placeholder="4242 4242 4242 4242" maxLength={19}
                            className="bg-slate-700 border-slate-600 text-white font-mono tracking-widest" />
                        </div>
                        <div>
                          <label className="text-slate-400 text-xs font-medium mb-1 block">Cardholder Name</label>
                          <Input value={form.cardName} onChange={e => set('cardName', e.target.value)}
                            placeholder="Marcus Carter"
                            className="bg-slate-700 border-slate-600 text-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-slate-400 text-xs font-medium mb-1 block">Expiry</label>
                            <Input value={form.cardExpiry}
                              onChange={e => set('cardExpiry', fmtExpiry(e.target.value))}
                              placeholder="MM/YY" maxLength={5}
                              className="bg-slate-700 border-slate-600 text-white font-mono" />
                          </div>
                          <div>
                            <label className="text-slate-400 text-xs font-medium mb-1 block">Visa/MC debit only</label>
                            <div className="h-10 bg-slate-700 border border-slate-600 rounded-md flex items-center px-3 gap-2">
                              <span className="text-xs text-slate-500">💳 Debit only — no credit cards</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-500 text-xs flex items-start gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          Instant payouts require a Visa or Mastercard debit card. Credit cards are not accepted for driver payouts.
                        </p>
                      </motion.div>
                    )}

                    {/* ACH bank form */}
                    {payoutMethod === 'standard' && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="space-y-4 bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="h-4 w-4 text-emerald-400" />
                          <p className="text-emerald-400 text-xs font-semibold">Bank-level encryption · Powered by Stripe</p>
                        </div>
                        <div>
                          <label className="text-slate-400 text-xs font-medium mb-1 block">Routing Number</label>
                          <Input value={form.bankRouting} onChange={e => set('bankRouting', e.target.value.replace(/\D/g,'').slice(0,9))}
                            placeholder="021000021" maxLength={9}
                            className="bg-slate-700 border-slate-600 text-white font-mono" />
                        </div>
                        <div>
                          <label className="text-slate-400 text-xs font-medium mb-1 block">Account Number</label>
                          <div className="relative">
                            <Input type={showAcct ? 'text' : 'password'}
                              value={form.bankAccount} onChange={e => set('bankAccount', e.target.value.replace(/\D/g,'').slice(0,17))}
                              placeholder="••••••••••••" maxLength={17}
                              className="bg-slate-700 border-slate-600 text-white font-mono pr-10" />
                            <button type="button" onClick={() => setShowAcct(s => !s)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                              {showAcct ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-500 text-xs flex items-start gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          A small test deposit ($0.01) will be sent to verify your account. Payouts begin after verification.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Example payout breakdown */}
                {payoutMethod && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <p className="text-slate-300 font-semibold text-sm mb-3">Example Payout on a $300 Delivery</p>
                    <div className="space-y-2 text-sm">
                      {[
                        { label: 'Shipper Pays',    value: '$300.00', cls: 'text-white' },
                        { label: 'Platform Fee (5%)', value: '−$15.00', cls: 'text-slate-500' },
                        payoutMethod === 'instant'
                          ? { label: 'Instant Pay Fee',  value: '−$0.50',  cls: 'text-slate-500' }
                          : { label: 'Transfer Fee',     value: 'Free',    cls: 'text-emerald-400' },
                        { label: 'You Receive',    value: payoutMethod === 'instant' ? '$284.50' : '$285.00', cls: 'text-emerald-400 font-bold' },
                      ].map(({ label, value, cls }) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-slate-400">{label}</span>
                          <span className={cls}>{value}</span>
                        </div>
                      ))}
                      <Separator className="bg-slate-700 my-1" />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Timing</span>
                        <span>{payoutMethod === 'instant' ? '⚡ ~30 min after drop-off' : '🏦 1–2 business days'}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={prevStep} variant="outline" className="border-slate-700 text-slate-400 hover:text-white h-12 px-6">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleFinish} disabled={!payoutMethod}
                    className="flex-1 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold h-12 gap-2">
                    <Shield className="h-4 w-4" />
                    Complete Setup
                  </Button>
                </div>

                <p className="text-center text-slate-600 text-xs pb-4">
                  Your financial info is encrypted and stored securely. VanRoute Pro never stores full card numbers.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
