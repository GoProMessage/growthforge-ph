"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Lock, CheckCircle, DollarSign, Shield, Truck } from "lucide-react"
import { formatCurrency } from "@/lib/calculator"

interface PaymentFormProps {
  deliveryId: string
  amount: number
  description: string
  onSuccess?: () => void
}

export function PaymentForm({ deliveryId, amount, description, onSuccess }: PaymentFormProps) {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form')
  const [form, setForm] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    email: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const platformFee = Math.round(amount * 0.05 * 100) / 100
  const totalCharge = Math.round((amount + platformFee) * 100) / 100

  const formatCardNumber = (val: string) => {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 4)
    if (clean.length >= 3) return `${clean.slice(0, 2)}/${clean.slice(2)}`
    return clean
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.cardName.trim()) e.cardName = 'Name required'
    if (form.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Invalid card number'
    if (form.expiry.length < 5) e.expiry = 'Invalid expiry'
    if (form.cvv.length < 3) e.cvv = 'Invalid CVV'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStep('processing')
    setTimeout(() => {
      setStep('success')
      onSuccess?.()
    }, 2500)
  }

  if (step === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-500/30 rounded-full animate-spin border-t-orange-500" />
          <Lock className="h-6 w-6 text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-lg">Processing Payment...</p>
          <p className="text-slate-400 text-sm mt-1">Securely charging {formatCurrency(totalCharge)}</p>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <Shield className="h-3.5 w-3.5 text-emerald-500" />
          <span>256-bit SSL encryption</span>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center ring-4 ring-emerald-500/30">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-xl">Payment Confirmed!</p>
          <p className="text-slate-400 text-sm mt-1">{formatCurrency(totalCharge)} charged successfully</p>
          <p className="text-slate-500 text-xs mt-1">Delivery ID: {deliveryId}</p>
        </div>
        <div className="bg-slate-800/60 rounded-lg p-4 w-full border border-slate-700">
          <p className="text-center text-emerald-400 font-semibold text-sm">✓ Driver has been notified</p>
          <p className="text-center text-slate-400 text-xs mt-1">You'll receive a confirmation email shortly</p>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <Truck className="h-3.5 w-3.5 text-orange-500" />
          <span>Track your delivery in the Shipper Portal</span>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Order Summary */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-3">Order Summary</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Delivery Service</span>
            <span className="text-white font-medium">{formatCurrency(amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Platform Fee (5%)</span>
            <span className="text-white font-medium">{formatCurrency(platformFee)}</span>
          </div>
          <Separator className="bg-slate-700 my-2" />
          <div className="flex justify-between font-bold">
            <span className="text-white">Total Charge</span>
            <span className="text-orange-400 text-lg">{formatCurrency(totalCharge)}</span>
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label className="text-slate-300 text-sm">Email for Receipt</Label>
        <Input
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
        />
        {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
      </div>

      {/* Card Name */}
      <div className="space-y-1.5">
        <Label className="text-slate-300 text-sm">Name on Card</Label>
        <Input
          placeholder="John Smith"
          value={form.cardName}
          onChange={e => setForm(f => ({ ...f, cardName: e.target.value }))}
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
        />
        {errors.cardName && <p className="text-red-400 text-xs">{errors.cardName}</p>}
      </div>

      {/* Card Number */}
      <div className="space-y-1.5">
        <Label className="text-slate-300 text-sm">Card Number</Label>
        <div className="relative">
          <Input
            placeholder="1234 5678 9012 3456"
            value={form.cardNumber}
            onChange={e => setForm(f => ({ ...f, cardNumber: formatCardNumber(e.target.value) }))}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 pr-12 font-mono"
            maxLength={19}
          />
          <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
        </div>
        {errors.cardNumber && <p className="text-red-400 text-xs">{errors.cardNumber}</p>}
      </div>

      {/* Expiry + CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-sm">Expiry Date</Label>
          <Input
            placeholder="MM/YY"
            value={form.expiry}
            onChange={e => setForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 font-mono"
            maxLength={5}
          />
          {errors.expiry && <p className="text-red-400 text-xs">{errors.expiry}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-sm">CVV</Label>
          <Input
            placeholder="123"
            type="password"
            value={form.cvv}
            onChange={e => setForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 font-mono"
            maxLength={4}
          />
          {errors.cvv && <p className="text-red-400 text-xs">{errors.cvv}</p>}
        </div>
      </div>

      {/* Security Badges */}
      <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-emerald-500" />
          <span>SSL Secured</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5 text-blue-400" />
          <span>PCI Compliant</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle className="h-3.5 w-3.5 text-orange-400" />
          <span>Buyer Protected</span>
        </div>
      </div>

      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold text-base h-12 gap-2">
        <Lock className="h-5 w-5" />
        Pay {formatCurrency(totalCharge)} Securely
      </Button>
    </form>
  )
}
