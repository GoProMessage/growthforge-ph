"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { MOCK_SHIPPERS, MOCK_DELIVERIES } from "@/lib/mock-data"
import { formatCurrency, estimateDriveTime } from "@/lib/calculator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Package, DollarSign, Star, Truck, MapPin, TrendingUp,
  Clock, ArrowRight, Plus, CheckCircle, Activity
} from "lucide-react"

const shipper = MOCK_SHIPPERS[0]

const activeDeliveries = [
  { id: 'a001', route: 'Charlotte, NC → Raleigh, NC', status: 'in-transit', driver: 'James W.', eta: '2:30 PM', pay: formatCurrency(215.80), progress: 65 },
  { id: 'a002', route: 'Columbia, SC → Charleston, SC', status: 'assigned', driver: 'Maria G.', eta: 'Today 5:00 PM', pay: formatCurrency(147.25), progress: 15 },
]

const pastDeliveries = [
  { id: 'p001', route: 'Atlanta, GA → Savannah, GA', date: '2026-06-24', driver: 'David C.', pay: 284.50, status: 'completed', rating: 5 },
  { id: 'p002', route: 'Greensboro, NC → Durham, NC', date: '2026-06-20', driver: 'Angela B.', pay: 117.60, status: 'completed', rating: 4 },
  { id: 'p003', route: 'Greenville, SC → Spartanburg, SC', date: '2026-06-18', driver: 'Marcus D.', pay: 89.40, status: 'completed', rating: 5 },
  { id: 'p004', route: 'Macon, GA → Columbus, GA', date: '2026-06-15', driver: 'James W.', pay: 149.25, status: 'completed', rating: 5 },
]

const scheduledDeliveries = [
  { id: 's001', route: 'Charlotte, NC → Raleigh, NC', day: 'Every Monday', time: '9:00 AM', vehicle: 'Sprinter Van', pay: formatCurrency(215) },
  { id: 's002', route: 'Myrtle Beach, SC → Florence, SC', day: 'Every Wednesday', time: '6:00 AM', vehicle: 'Cargo Van', pay: formatCurrency(89) },
]

export default function ShipperPage() {
  const [tab, setTab] = useState('active')

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Shipper Header */}
        <Card className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-500/5 border-slate-800 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Avatar className="w-16 h-16 ring-2 ring-blue-500/50">
                <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xl font-bold">
                  {shipper.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-1">{shipper.name}</h1>
                <p className="text-slate-400 text-sm mb-2">{shipper.company}</p>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><Star className="h-4 w-4 text-orange-400 fill-orange-400" /> {shipper.rating} shipper rating</span>
                  <span className="flex items-center gap-1"><Package className="h-4 w-4" /> {shipper.totalDeliveries} deliveries posted</span>
                </div>
              </div>
              <Link href="/post-delivery">
                <Button className="bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2 h-11">
                  <Plus className="h-4 w-4" />
                  Post New Delivery
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Deliveries', value: activeDeliveries.length, icon: Activity, color: 'text-orange-400', sub: 'In progress now' },
            { label: 'Total Spent', value: formatCurrency(shipper.totalSpent), icon: DollarSign, color: 'text-emerald-400', sub: 'All time' },
            { label: 'Total Deliveries', value: shipper.totalDeliveries, icon: Package, color: 'text-blue-400', sub: 'Completed' },
            { label: 'Scheduled Routes', value: scheduledDeliveries.length, icon: Clock, color: 'text-purple-400', sub: 'Recurring' },
          ].map(({ label, value, icon: Icon, color, sub }) => (
            <Card key={label} className="bg-slate-900 border-slate-800">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <p className="text-white font-bold text-xl">{value}</p>
                  <p className="text-slate-500 text-xs">{label}</p>
                  <p className="text-slate-600 text-xs">{sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="active">
          <TabsList className="bg-slate-900 border border-slate-800 mb-6">
            <TabsTrigger value="active" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-slate-400">
              Active ({activeDeliveries.length})
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-slate-400">
              Scheduled ({scheduledDeliveries.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-slate-400">
              History ({pastDeliveries.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeDeliveries.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-400 text-lg">No active deliveries</p>
                <Link href="/post-delivery" className="mt-4 inline-block">
                  <Button className="bg-orange-500 hover:bg-orange-400 text-white">Post a Delivery</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeDeliveries.map((d, i) => (
                  <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="bg-slate-900 border-slate-800">
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-white font-bold">{d.route}</h3>
                              <Badge className={d.status === 'in-transit'
                                ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}>
                                {d.status === 'in-transit' ? '🚛 In Transit' : '📋 Assigned'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                              <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> Driver: <span className="text-white ml-1">{d.driver}</span></span>
                              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> ETA: <span className="text-emerald-400 ml-1">{d.eta}</span></span>
                              <span className="text-orange-400 font-semibold">{d.pay}</span>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full bg-slate-800 rounded-full h-2">
                              <div
                                className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${d.progress}%` }}
                              />
                            </div>
                            <p className="text-slate-600 text-xs mt-1">{d.progress}% complete</p>
                          </div>
                          <Button variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:text-white shrink-0 gap-1">
                            <MapPin className="h-4 w-4" />
                            Track
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="scheduled">
            <div className="space-y-4">
              {scheduledDeliveries.map((s, i) => (
                <Card key={s.id} className="bg-slate-900 border-slate-800 border-l-4 border-l-purple-500">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-white font-bold mb-1">{s.route}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {s.day} @ {s.time}</span>
                        <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> {s.vehicle}</span>
                        <span className="text-orange-400 font-semibold">{s.pay}</span>
                      </div>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Recurring</Badge>
                  </CardContent>
                </Card>
              ))}
              <Link href="/post-delivery">
                <Button variant="outline" className="border-dashed border-slate-700 text-slate-500 hover:text-white hover:border-slate-600 w-full h-14 gap-2">
                  <Plus className="h-5 w-5" />
                  Add Scheduled Route
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-0">
                <div className="divide-y divide-slate-800">
                  {pastDeliveries.map((d, i) => (
                    <motion.div key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-4 hover:bg-slate-800/40 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{d.route}</p>
                        <p className="text-slate-500 text-xs">{d.date} · Driver: {d.driver}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-0.5">
                          {[...Array(d.rating)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 text-orange-400 fill-orange-400" />)}
                        </div>
                        <p className="text-emerald-400 font-bold">{formatCurrency(d.pay)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
