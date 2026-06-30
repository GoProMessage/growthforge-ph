"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Truck, Search, Package, MapPin, Clock, DollarSign,
  Shield, Zap, Users, Star, ArrowRight, CheckCircle,
  Navigation, Calendar, BarChart3, TrendingUp, Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShareModal } from "@/components/share-modal"
import { CITIES } from "@/lib/cities"
import { formatCurrency } from "@/lib/calculator"

// ── Animated number counter ────────────────────────────────────────────────
function AnimatedCounter({ target, prefix = "", suffix = "", duration = 2000 }: {
  target: number; prefix?: string; suffix?: string; duration?: number
}) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = Date.now()
        const tick = () => {
          const elapsed = Date.now() - start
          const progress = Math.min(elapsed / duration, 1)
          const ease = 1 - Math.pow(1 - progress, 3)
          setValue(Math.floor(ease * target))
          if (progress < 1) requestAnimationFrame(tick)
          else setValue(target)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{prefix}{value.toLocaleString()}{suffix}</span>
}

const FEATURED_CITIES = CITIES.slice(0, 10)

const FEATURES = [
  { icon: Navigation, title: "Built-in GPS Routing", desc: "Turn-by-turn directions with real route distance calculation — no app switching.", color: "text-orange-400" },
  { icon: DollarSign, title: "Instant Cost Calculator", desc: "Transparent pricing: base fee + mileage rate for Cargo and Sprinter vans.", color: "text-emerald-400" },
  { icon: Zap, title: "Live Load Board", desc: "New delivery opportunities appear every 35 seconds. Never miss a load.", color: "text-yellow-400" },
  { icon: Calendar, title: "Scheduled Deliveries", desc: "Plan recurring routes, set pickup windows, and manage your schedule.", color: "text-blue-400" },
  { icon: Shield, title: "Secure Online Payment", desc: "Shippers pay online before dispatch. Stripe-secured, instant transfer.", color: "text-purple-400" },
  { icon: Users, title: "Growing Network", desc: "Connect with shippers across SC, NC & GA. Share & earn $50 per referral.", color: "text-pink-400" },
]

const TESTIMONIALS = [
  { name: "Marcus T.", city: "Charlotte, NC", rating: 5, vehicle: "Sprinter Van", text: "I cleared $1,800 last week just working SC and NC routes. The GPS built right in saves so much time.", avatar: "MT" },
  { name: "Deja W.", city: "Atlanta, GA", rating: 5, vehicle: "Cargo Van", text: "Post a delivery in 2 minutes. Drivers show up on time. This replaced 3 other tools for me.", avatar: "DW" },
  { name: "Raymond K.", city: "Columbia, SC", rating: 5, vehicle: "Sprinter Van", text: "The scheduled delivery feature is a game changer. I have recurring routes locked in every week.", avatar: "RK" },
]

export default function HomePage() {
  const [liveCount, setLiveCount] = useState(23)
  const [pulse, setPulse] = useState(true)

  useEffect(() => {
    const iv = setInterval(() => {
      setLiveCount(c => c + 1)
      setPulse(p => !p)
    }, 8000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative">
          <motion.div
            className="text-center space-y-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Live badge */}
            <div className="flex items-center justify-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 gap-2 px-4 py-1.5 text-sm">
                <span className={`w-2 h-2 rounded-full bg-emerald-500 ${pulse ? "animate-pulse" : ""}`} />
                {liveCount} loads available right now
              </Badge>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none">
              Find Cargo &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                Sprinter Van
              </span>{" "}
              Loads in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                SC · NC · GA
              </span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              The #1 logistics platform connecting owner-operators with delivery loads.
              Built-in GPS routing, instant online pay, and a live board that never stops scanning.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/opportunities">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-400 text-white font-bold text-base px-8 gap-2 h-14 shadow-lg shadow-orange-500/25">
                  <Search className="h-5 w-5" />
                  Browse Live Loads
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/post-delivery">
                <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-semibold text-base px-8 h-14 gap-2">
                  <Package className="h-5 w-5" />
                  Post a Delivery
                </Button>
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-slate-500 text-sm">
              {["No subscription fees", "Secure online payments", "Real-time GPS routing", "SC · NC · GA coverage"].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Active Loads", target: 247, suffix: "+", icon: Package, color: "text-orange-400" },
              { label: "Weekly Avg Earnings", target: 1200, prefix: "$", suffix: "+", icon: DollarSign, color: "text-emerald-400" },
              { label: "Cities Covered", target: 30, suffix: " cities", icon: MapPin, color: "text-blue-400" },
              { label: "Drivers Placed", target: 1840, suffix: "+", icon: Truck, color: "text-purple-400" },
            ].map(({ label, target, prefix, suffix, icon: Icon, color }) => (
              <div key={label} className="text-center space-y-2">
                <Icon className={`h-6 w-6 mx-auto ${color}`} />
                <p className={`text-3xl sm:text-4xl font-extrabold ${color}`}>
                  <AnimatedCounter target={target} prefix={prefix} suffix={suffix} />
                </p>
                <p className="text-slate-400 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mb-4">Platform Features</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Everything You Need to Run Loads</h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">One platform. No extra apps, no fragmented workflows.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className={`inline-flex p-3 rounded-xl bg-slate-800 mb-4`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Vehicle Types ─────────────────────────────────────────────────── */}
      <section className="bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-14">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-4">Vehicle Types</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Choose Your Earning Vehicle</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                type: "Cargo Van",
                icon: "🚐",
                base: 35,
                rate: 1.25,
                color: "border-orange-500/40 bg-orange-500/5",
                badge: "bg-orange-500/20 text-orange-400 border-orange-500/30",
                perks: ["Local & regional routes", "Up to 2,500 lbs capacity", "Easy urban navigation", "Lower fuel cost"],
              },
              {
                type: "Sprinter Van",
                icon: "🚌",
                base: 55,
                rate: 1.75,
                color: "border-blue-500/40 bg-blue-500/5",
                badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                perks: ["Long-haul interstate loads", "Up to 4,500 lbs capacity", "Higher payout per mile", "Recurring freight routes"],
              },
            ].map(({ type, icon, base, rate, color, badge, perks }) => (
              <div key={type} className={`rounded-2xl border-2 p-8 ${color}`}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">{icon}</span>
                  <div>
                    <h3 className="text-2xl font-extrabold">{type}</h3>
                    <Badge className={`text-xs mt-1 ${badge}`}>Available Now</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-800/60 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-white">{formatCurrency(base)}</p>
                    <p className="text-slate-400 text-xs mt-1">Base Fee</p>
                  </div>
                  <div className="bg-slate-800/60 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-white">${rate}/mi</p>
                    <p className="text-slate-400 text-xs mt-1">Mileage Rate</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {perks.map(p => (
                    <li key={p} className="flex items-center gap-2 text-slate-300 text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link href="/opportunities">
                  <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white gap-2">
                    View {type} Loads
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── City Grid ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-4">Coverage Area</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Active Markets</h2>
          <p className="text-slate-400 mt-3">Loads available across 30 cities in three states</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {FEATURED_CITIES.map((city) => {
            const loads = Math.floor(Math.random() * 12) + 2
            const stateColors: Record<string, string> = {
              SC: "text-orange-400 bg-orange-500/10 border-orange-500/20",
              NC: "text-blue-400 bg-blue-500/10 border-blue-500/20",
              GA: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
            }
            return (
              <Link key={city.name} href="/opportunities">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 hover:bg-slate-800/60 transition-all group cursor-pointer">
                  <div className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold border mb-2 ${stateColors[city.state]}`}>
                    {city.state}
                  </div>
                  <p className="font-semibold text-white text-sm group-hover:text-orange-400 transition-colors">{city.name}</p>
                  <p className="text-slate-500 text-xs mt-1">{loads} loads</p>
                </div>
              </Link>
            )
          })}
        </div>
        <div className="text-center mt-8">
          <Link href="/opportunities">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 gap-2">
              View All 30 Cities
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-14">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 mb-4">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold">What Operators Are Saying</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, city, rating, vehicle, text, avatar }) => (
              <div key={name} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-sm">
                    {avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{name}</p>
                    <p className="text-slate-500 text-xs">{city} · {vehicle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent border border-orange-500/30 rounded-3xl p-12 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/30 mb-2">
            <TrendingUp className="h-8 w-8 text-orange-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to Start Earning?</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Join hundreds of owner-operators running loads across SC, NC & GA.
            Free to join — start earning this week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/join">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-400 text-white font-bold text-base px-10 h-14 gap-2 shadow-lg shadow-orange-500/25">
                <Truck className="h-5 w-5" />
                Join Free Today
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <ShareModal
              trigger={
                <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-semibold text-base px-8 h-14 gap-2">
                  <Users className="h-5 w-5" />
                  Invite & Earn $50
                </Button>
              }
            />
          </div>
        </div>
      </section>

    </div>
  )
}
