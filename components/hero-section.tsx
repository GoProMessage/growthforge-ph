"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap } from "lucide-react"

const stats = [
  { label: "Businesses Served", value: "500+" },
  { label: "Content Pieces", value: "50K+" },
  { label: "SEO Audits", value: "12K+" },
  { label: "Avg. Growth", value: "43%" },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-amber-50 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 mb-4 text-sm px-3 py-1 hover:bg-amber-100">
                🇵🇭 Built for Philippine Entrepreneurs
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Grow Your{" "}
                <span className="text-blue-600">Negosyo</span>{" "}
                with{" "}
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">AI Power</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mt-6 leading-relaxed">
                The complete AI toolkit for Filipino SMEs — SEO audits, content generation,
                website builder, and business analytics. Everything you need to hit <strong>₱168K+/month</strong>.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-base px-8 h-12 gap-2 shadow-lg shadow-blue-200">
                  Start Free — 14 Days <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="text-base px-8 h-12">
                  View Live Demo
                </Button>
              </Link>
            </motion.div>

            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              ✓ No credit card required &nbsp;·&nbsp; ✓ GCash & PayMaya accepted &nbsp;·&nbsp; ✓ Cancel anytime
            </motion.p>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center border border-border/50 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Mock Dashboard Preview */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
              {/* Browser chrome */}
              <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-2 border-b">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-muted-foreground text-center">
                  app.negosyoai.com/dashboard
                </div>
              </div>

              <div className="flex">
                {/* Fake sidebar */}
                <div className="w-14 bg-blue-600 flex flex-col items-center py-4 gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-7 h-7 bg-white/10 rounded-md" />
                  ))}
                </div>

                {/* Fake dashboard content */}
                <div className="flex-1 p-4 space-y-3 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="h-4 w-36 bg-gray-200 rounded" />
                      <div className="h-3 w-24 bg-gray-100 rounded" />
                    </div>
                    <div className="w-24 h-7 bg-blue-600 rounded-lg" />
                  </div>

                  {/* Goal progress bar */}
                  <div className="bg-blue-600 rounded-xl p-3 text-white">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs text-blue-200">$3,000/Month Goal</div>
                      <div className="text-sm font-bold text-amber-400">29%</div>
                    </div>
                    <div className="bg-blue-800 rounded-full h-1.5">
                      <div className="bg-amber-400 h-1.5 rounded-full w-[29%]" />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "MRR", value: "₱48,500", color: "bg-green-50 text-green-700" },
                      { label: "Clients", value: "23", color: "bg-blue-50 text-blue-700" },
                      { label: "SEO Score", value: "87/100", color: "bg-amber-50 text-amber-700" },
                    ].map((item) => (
                      <div key={item.label} className={`${item.color} rounded-lg p-2 bg-white`}>
                        <div className="text-sm font-bold">{item.value}</div>
                        <div className="text-[10px] opacity-70">{item.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="bg-white rounded-lg p-2 border">
                    <div className="text-xs text-muted-foreground mb-1.5">Revenue Growth (MRR)</div>
                    <div className="flex items-end gap-0.5 h-14">
                      {[25, 35, 30, 50, 42, 62, 55, 78, 68, 90, 82, 100].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm"
                          style={{ height: `${(h / 100) * 100}%`, backgroundColor: `hsl(221, 83%, ${40 + i * 3}%)` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Tool cards */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border rounded-lg p-2 bg-white">
                      <div className="text-[10px] font-medium text-blue-700">SEO Audit</div>
                      <div className="text-sm font-bold text-green-600">87/100 ✓</div>
                    </div>
                    <div className="border rounded-lg p-2 bg-white">
                      <div className="text-[10px] font-medium text-purple-700">AI Content</div>
                      <div className="text-sm font-bold text-purple-600">142 pieces</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
