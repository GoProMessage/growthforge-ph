"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { MOCK_DELIVERIES } from "@/lib/mock-data"
import { PaymentForm } from "@/components/payment-form"
import { formatCurrency } from "@/lib/calculator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Truck, MapPin, Clock, DollarSign, Shield, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [paid, setPaid] = useState(false)

  const delivery = MOCK_DELIVERIES.find(d => d.id === id) || MOCK_DELIVERIES[0]

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-slate-400 hover:text-white gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2 ml-auto text-slate-500 text-sm">
            <Lock className="h-4 w-4 text-emerald-500" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">Secure Payment</h1>
          <p className="text-slate-400">Complete your delivery booking with secure online payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Delivery Summary */}
          <div className="space-y-5">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">Delivery Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className={`h-5 w-5 mt-0.5 ${delivery.vehicleType === 'sprinter-van' ? 'text-purple-400' : 'text-blue-400'}`} />
                  <div>
                    <p className="text-slate-500 text-xs">Vehicle Type</p>
                    <p className="text-white font-semibold">{delivery.vehicleType === 'sprinter-van' ? 'Sprinter Van' : 'Cargo Van'}</p>
                  </div>
                </div>

                {/* Route */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 text-orange-400" />
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col items-center gap-1 mt-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <div className="w-0.5 h-6 bg-slate-700" />
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{delivery.pickup.city}, {delivery.pickup.state}</p>
                        <p className="text-slate-500 text-xs mb-3">{delivery.pickup.address}</p>
                        <p className="text-white font-medium text-sm">{delivery.dropoff.city}, {delivery.dropoff.state}</p>
                        <p className="text-slate-500 text-xs">{delivery.dropoff.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-emerald-400 text-xs mb-1 font-medium">Pickup</p>
                    <p className="text-white text-sm font-semibold">{delivery.pickupDate}</p>
                    <p className="text-slate-400 text-sm">@ {delivery.pickupTime}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-red-400 text-xs mb-1 font-medium">Delivery</p>
                    <p className="text-white text-sm font-semibold">{delivery.deliveryDate}</p>
                    <p className="text-slate-400 text-sm">@ {delivery.deliveryTime}</p>
                  </div>
                </div>

                {/* Cost */}
                <div className="bg-slate-800/40 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Base Fee</span>
                    <span className="text-white">{formatCurrency(delivery.baseFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Mileage ({delivery.distance} mi)</span>
                    <span className="text-white">{formatCurrency(delivery.mileageCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Platform Fee (5%)</span>
                    <span className="text-white">{formatCurrency(Math.round(delivery.totalCost * 0.05 * 100) / 100)}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-2 flex justify-between font-bold">
                    <span className="text-white">Total Charge</span>
                    <span className="text-orange-400 text-xl">{formatCurrency(Math.round(delivery.totalCost * 1.05 * 100) / 100)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-5">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Shield, color: 'text-emerald-400', label: 'SSL Secured' },
                    { icon: Lock, color: 'text-blue-400', label: 'PCI Compliant' },
                    { icon: CheckCircle, color: 'text-orange-400', label: 'Buyer Protection' },
                  ].map(({ icon: Icon, color, label }) => (
                    <div key={label} className="text-center">
                      <Icon className={`h-6 w-6 ${color} mx-auto mb-2`} />
                      <p className="text-slate-400 text-xs">{label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <p className="text-slate-600 text-xs text-center">
              By completing payment, you agree to the VanRoute Pro terms of service.
              All transactions are encrypted and securely processed.
            </p>
          </div>

          {/* Payment Form */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-orange-500" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <PaymentForm
                deliveryId={delivery.id}
                amount={delivery.totalCost}
                description={delivery.description}
                onSuccess={() => setPaid(true)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
