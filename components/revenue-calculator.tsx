"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign } from "lucide-react"

const prices = { starter: 1499, growth: 2999, pro: 4999 }
const USD_RATE = 56

export function RevenueCalculator() {
  const [clients, setClients] = useState(20)
  const [plan, setPlan] = useState<"starter" | "growth" | "pro">("growth")

  const monthlyRevenuePHP = clients * prices[plan]
  const monthlyRevenueUSD = Math.round(monthlyRevenuePHP / USD_RATE)
  const annualRevenuePHP = monthlyRevenuePHP * 12
  const goalMet = monthlyRevenueUSD >= 3000
  const clientsNeeded = Math.ceil(168000 / prices[plan])

  return (
    <section id="calculator" className="py-24 bg-gradient-to-br from-blue-600 to-blue-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="bg-white/20 text-white border-white/30 mb-4">Revenue Potential</Badge>
          <h2 className="text-4xl font-bold">Calculate Your Earning Potential</h2>
          <p className="text-blue-200 mt-4 text-lg">
            See how much you can earn by selling NegosyoAI subscriptions to Philippine businesses
          </p>
        </motion.div>

        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 space-y-8 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {/* Plan selector */}
          <div>
            <label className="text-sm font-medium text-blue-100 mb-3 block">Client Plan Price</label>
            <div className="flex flex-wrap gap-3">
              {(["starter", "growth", "pro"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlan(p)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                    plan === p ? "bg-white text-blue-700 shadow-lg" : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {p} — ₱{prices[p].toLocaleString()}/mo
                </button>
              ))}
            </div>
          </div>

          {/* Slider */}
          <div>
            <label className="text-sm font-medium text-blue-100 mb-3 block">
              Number of Clients:{" "}
              <span className="text-2xl font-black text-white">{clients}</span>
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={clients}
              onChange={(e) => setClients(Number(e.target.value))}
              className="w-full h-2 rounded-full accent-amber-400"
            />
            <div className="flex justify-between text-xs text-blue-300 mt-2">
              <span>1 client</span>
              <span>50 clients</span>
              <span>100 clients</span>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-5 text-center">
              <div className="text-sm text-blue-200 mb-1">Monthly Revenue</div>
              <div className="text-3xl font-black">₱{monthlyRevenuePHP.toLocaleString()}</div>
              <div className="text-blue-300 text-sm mt-1">${monthlyRevenueUSD.toLocaleString()} USD</div>
            </div>
            <div className="bg-white/10 rounded-xl p-5 text-center">
              <div className="text-sm text-blue-200 mb-1">Annual Revenue</div>
              <div className="text-3xl font-black">₱{(annualRevenuePHP / 1000000).toFixed(1)}M</div>
              <div className="text-blue-300 text-sm mt-1">${(monthlyRevenueUSD * 12).toLocaleString()} USD/yr</div>
            </div>
            <div className="bg-white/10 rounded-xl p-5 text-center">
              <div className="text-sm text-blue-200 mb-1">Your Platform Cost</div>
              <div className="text-3xl font-black">₱4,999</div>
              <div className="text-blue-300 text-sm mt-1">Pro plan/month</div>
            </div>
          </div>

          {/* Alert */}
          {goalMet ? (
            <motion.div
              key="goal-met"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-400/20 border border-green-400/40 rounded-xl p-4 flex items-center gap-3"
            >
              <TrendingUp className="w-5 h-5 text-green-300 flex-shrink-0" />
              <span className="text-green-100 font-medium">
                🎉 With {clients} {plan} clients, you hit your <strong>$3,000/month goal</strong>! That's ${monthlyRevenueUSD.toLocaleString()}/month.
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="goal-not-met"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-amber-400/20 border border-amber-400/30 rounded-xl p-4 flex items-center gap-3"
            >
              <DollarSign className="w-5 h-5 text-amber-300 flex-shrink-0" />
              <span className="text-amber-100">
                You need <strong>{clientsNeeded} {plan} clients</strong> to reach $3,000/month. Currently at {clients}. Only <strong>{Math.max(0, clientsNeeded - clients)} more</strong> to go!
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
