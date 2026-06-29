"use client"

import { useState } from "react"
import Link from "next/link"
import { X, Clock, CreditCard, Bell, Check, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// In production this would come from auth session/Supabase.
// For the demo, we use 12 days remaining by default.
// Change MOCK_DAYS_REMAINING to 3 or less to see the urgent warning state.
const MOCK_DAYS_REMAINING: number = 12
const MOCK_TRIAL_END = (() => {
  const d = new Date()
  d.setDate(d.getDate() + MOCK_DAYS_REMAINING)
  return d.toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })
})()

const paymentMethods = [
  { id: "gcash", label: "GCash", color: "text-blue-600", hint: "Enter your GCash mobile number" },
  { id: "maya", label: "Maya", color: "text-green-600", hint: "Enter your Maya mobile number" },
  { id: "card", label: "Credit / Debit Card", color: "text-purple-600", hint: "Visa, Mastercard, or JCB" },
]

function AddPaymentDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [method, setMethod] = useState("gcash")
  const [saved, setSaved] = useState(false)
  const selected = paymentMethods.find(m => m.id === method)!

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Add Payment Method
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3 text-sm">
            <Bell className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-800">Trial ends {MOCK_TRIAL_END}</span>
              <p className="text-amber-600 mt-0.5 text-xs">
                Adding a payment method keeps your access uninterrupted. You won&apos;t be charged until your trial ends.
              </p>
            </div>
          </div>

          {/* Payment method selector */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Choose payment method</Label>
            <div className="flex gap-2 flex-wrap">
              {paymentMethods.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={cn(
                    "px-3 py-2 rounded-xl border text-sm font-medium transition-all",
                    method === m.id
                      ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                      : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 text-gray-600"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic fields */}
          {method === "gcash" && (
            <div className="space-y-2">
              <Label>GCash Mobile Number</Label>
              <Input placeholder="09XX XXX XXXX" className="h-11" maxLength={11} />
              <p className="text-xs text-muted-foreground">Enter the mobile number linked to your GCash account.</p>
            </div>
          )}
          {method === "maya" && (
            <div className="space-y-2">
              <Label>Maya Mobile Number</Label>
              <Input placeholder="09XX XXX XXXX" className="h-11" maxLength={11} />
              <p className="text-xs text-muted-foreground">Enter the mobile number linked to your Maya (PayMaya) account.</p>
            </div>
          )}
          {method === "card" && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Card Number</Label>
                <Input placeholder="1234 5678 9012 3456" className="h-11" maxLength={19} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input placeholder="MM / YY" className="h-11" maxLength={7} />
                </div>
                <div className="space-y-2">
                  <Label>CVV</Label>
                  <Input type="password" placeholder="•••" className="h-11" maxLength={4} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Name on Card</Label>
                <Input placeholder="Juan dela Cruz" className="h-11" />
              </div>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2.5 flex items-center gap-2 text-xs text-green-700">
            <Shield className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Secured with 256-bit SSL encryption. No charge until {MOCK_TRIAL_END}.</span>
          </div>

          {saved ? (
            <div className="flex items-center justify-center gap-2 py-3 text-green-600 font-semibold">
              <Check className="w-5 h-5" /> Payment method saved!
            </div>
          ) : (
            <Button
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-semibold"
              onClick={() => setSaved(true)}
            >
              Save {selected.label} — No Charge Until Trial Ends
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function TrialBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const isUrgent = MOCK_DAYS_REMAINING <= 3

  if (dismissed) return null

  return (
    <>
      <div className={cn(
        "w-full px-4 py-2.5 flex items-center gap-3 text-sm transition-all",
        isUrgent
          ? "bg-amber-500"
          : "bg-blue-600"
      )}>
        {/* Icon */}
        <div className={cn(
          "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center",
          isUrgent ? "bg-amber-400" : "bg-blue-500"
        )}>
          {isUrgent
            ? <Bell className="w-3.5 h-3.5 text-white" />
            : <Clock className="w-3.5 h-3.5 text-white" />
          }
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-white font-semibold">
            {isUrgent
              ? `⚠️ Only ${MOCK_DAYS_REMAINING} day${MOCK_DAYS_REMAINING !== 1 ? "s" : ""} left in your free trial!`
              : `🎉 ${MOCK_DAYS_REMAINING} days left in your free trial`
            }
          </span>
          <span className="text-white/80 text-xs hidden sm:inline">
            {isUrgent
              ? `Trial ends ${MOCK_TRIAL_END} · Add a payment method to keep access.`
              : `Enjoy full access until ${MOCK_TRIAL_END} · No payment needed yet.`
            }
          </span>
          {isUrgent && (
            <Badge className="bg-white/20 text-white border-0 text-[10px] font-black px-1.5 hidden sm:flex">
              ACTION REQUIRED
            </Badge>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isUrgent ? (
            <Button
              size="sm"
              className="h-7 px-3 bg-white text-amber-700 hover:bg-amber-50 font-bold text-xs border-0 shadow-none"
              onClick={() => setPaymentOpen(true)}
            >
              <CreditCard className="w-3.5 h-3.5 mr-1" />
              Add Payment
            </Button>
          ) : (
            <>
              <button
                className="text-white/70 hover:text-white text-xs underline underline-offset-2 hidden sm:block"
                onClick={() => setPaymentOpen(true)}
              >
                Add payment now
              </button>
              <Zap className="w-3.5 h-3.5 text-white/50 hidden sm:block" />
            </>
          )}
          {!isUrgent && (
            <button
              onClick={() => setDismissed(true)}
              className="text-white/60 hover:text-white ml-1 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <AddPaymentDialog open={paymentOpen} onOpenChange={setPaymentOpen} />
    </>
  )
}
