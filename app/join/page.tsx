"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Truck, CheckCircle, DollarSign, MapPin, Star,
  ArrowRight, Gift, Shield, Search, Calendar, CreditCard
} from "lucide-react"

const perks = [
  { icon: Search, title: 'Live Load Board', desc: '25+ new loads every day across SC, NC & GA' },
  { icon: DollarSign, title: '$1,200+ Weekly', desc: 'Average driver earnings on the platform' },
  { icon: MapPin, title: 'Built-in GPS', desc: 'Turn-by-turn routing — no switching apps' },
  { icon: Calendar, title: 'Scheduled Routes', desc: 'Book recurring deliveries weeks in advance' },
  { icon: CreditCard, title: 'Instant Pay', desc: 'Get paid online after every delivery' },
  { icon: Shield, title: 'Fully Verified', desc: 'Verified shippers and secure platform' },
]

// Inner component that safely reads searchParams
function JoinPageInner() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref') || ''

  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '', city: '' })
  const [submitted, setSubmitted] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.role) return
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
          <h2 className="text-3xl font-extrabold text-white mb-3">You&apos;re In! Welcome to VanRoute Pro 🚛</h2>
          <p className="text-slate-400 mb-2">Account created successfully.</p>
          {ref && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Gift className="h-5 w-5 text-orange-400" />
                <p className="text-orange-300 font-semibold">Referral Bonus Applied!</p>
              </div>
              <p className="text-slate-400 text-sm">
                You were referred by code <span className="text-orange-400 font-mono font-bold">{ref}</span>.
                Both you and your referrer earn <span className="text-orange-400 font-bold">$50</span> after your first completed delivery!
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/opportunities" className="flex-1">
              <Button className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2 h-12">
                <Search className="h-4 w-4" />
                Browse Live Loads
              </Button>
            </Link>
            <Link href={form.role === 'shipper' ? '/post-delivery' : '/driver'} className="flex-1">
              <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 h-12 gap-2">
                <ArrowRight className="h-4 w-4" />
                Go to {form.role === 'shipper' ? 'Shipper Portal' : 'Driver Portal'}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-orange-500/8 via-slate-950 to-slate-950 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-2">
                <Truck className="h-4 w-4 text-orange-400" />
                <span className="text-orange-300 text-sm font-semibold">VanRoute Pro — Southeast&apos;s #1 Logistics Network</span>
              </div>
            </div>

            {ref && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-5 py-3 mb-6"
              >
                <Gift className="h-5 w-5 text-emerald-400" />
                <div className="text-left">
                  <p className="text-emerald-300 font-semibold text-sm">You were personally invited! 🎉</p>
                  <p className="text-slate-400 text-xs">Referral code: <span className="text-emerald-400 font-mono font-bold">{ref}</span> · Both you and your referrer earn $50 on first delivery</p>
                </div>
              </motion.div>
            )}

            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Join VanRoute Pro Today
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Connect with shippers across <span className="text-white">South Carolina</span>, <span className="text-white">North Carolina</span>, and <span className="text-white">Georgia</span>.
              Cargo vans &amp; sprinter vans welcome.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Sign Up Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="bg-slate-900 border-slate-800 shadow-2xl">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Create Free Account</h2>
                  <p className="text-slate-500 text-sm mb-6">No subscription fees. Pay only when you earn.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-slate-300">Full Name *</Label>
                      <Input value={form.name} onChange={e => set('name', e.target.value)}
                        placeholder="John Smith" required
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-11" />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-slate-300">Email Address *</Label>
                      <Input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                        placeholder="john@example.com" required
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-11" />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-slate-300">Phone Number</Label>
                      <Input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                        placeholder="704-555-0100"
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-11" />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-slate-300">I am joining as *</Label>
                      <Select onValueChange={v => set('role', v)} required>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-300 h-11">
                          <SelectValue placeholder="Select your role..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                          <SelectItem value="driver" className="text-slate-300">🚛 Driver / Owner-Operator</SelectItem>
                          <SelectItem value="shipper" className="text-slate-300">📦 Shipper / Business</SelectItem>
                          <SelectItem value="both" className="text-slate-300">🔄 Both Driver &amp; Shipper</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-slate-300">Your City</Label>
                      <Input value={form.city} onChange={e => set('city', e.target.value)}
                        placeholder="Charlotte, NC"
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-11" />
                    </div>

                    {ref && (
                      <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <Gift className="h-4 w-4 text-emerald-400 shrink-0" />
                        <div className="flex-1">
                          <p className="text-emerald-300 text-xs font-medium">Referral code applied</p>
                          <p className="text-slate-500 text-xs font-mono">{ref}</p>
                        </div>
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      </div>
                    )}

                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold h-12 text-base gap-2 mt-2">
                      <Truck className="h-5 w-5" />
                      Join VanRoute Pro Free
                      <ArrowRight className="h-4 w-4" />
                    </Button>

                    <p className="text-center text-slate-600 text-xs">
                      Free to join · No credit card required · Cancel anytime
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Perks */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              {/* Social Proof */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex -space-x-2">
                    {['JW', 'MG', 'DC', 'AB', 'MD'].map(init => (
                      <div key={init} className="w-8 h-8 rounded-full bg-orange-500/30 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-orange-300">
                        {init}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">87+ drivers already earning</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 text-orange-400 fill-orange-400" />)}
                      <span className="text-slate-500 text-xs ml-1">4.9/5 avg rating</span>
                    </div>
                  </div>
                </div>
                <blockquote className="text-slate-400 text-sm italic border-l-2 border-orange-500/50 pl-4">
                  &quot;VanRoute changed everything for me. I fill my schedule 3 weeks out and made $2,800 last week alone.&quot;
                  <footer className="text-slate-500 text-xs mt-1 not-italic">— James W., Sprinter Van Driver · Charlotte, NC</footer>
                </blockquote>
              </div>

              {/* Platform Perks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {perks.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coverage */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                <p className="text-white font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  Coverage Area
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { state: 'SC', name: 'South Carolina', cities: 10 },
                    { state: 'NC', name: 'North Carolina', cities: 10 },
                    { state: 'GA', name: 'Georgia', cities: 10 },
                  ].map(({ state, name, cities }) => (
                    <div key={state} className="bg-slate-800/60 rounded-lg p-3">
                      <p className="text-orange-400 font-extrabold text-xl">{state}</p>
                      <p className="text-white text-xs font-medium">{name}</p>
                      <p className="text-slate-600 text-xs">{cities} cities</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Wrap in Suspense to satisfy Next.js static generation requirement for useSearchParams
export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <JoinPageInner />
    </Suspense>
  )
}
