"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { MOCK_DRIVERS, MOCK_DELIVERIES } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/calculator"
import { DeliveryCard } from "@/components/delivery-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Truck, DollarSign, Star, Package, MapPin, TrendingUp,
  CheckCircle, Clock, ArrowRight, Search, Activity, Calendar
} from "lucide-react"
import { ShareModal } from "@/components/share-modal"

const driver = MOCK_DRIVERS[0]
const availableLoads = MOCK_DELIVERIES.filter(d => d.status === 'available').slice(0, 6)

const completedDeliveries = [
  { id: 'c001', route: 'Charlotte, NC → Raleigh, NC', date: '2026-06-25', pay: 215.80, vehicle: 'Sprinter Van', miles: 161 },
  { id: 'c002', route: 'Columbia, SC → Charleston, SC', date: '2026-06-23', pay: 147.25, vehicle: 'Sprinter Van', miles: 113 },
  { id: 'c003', route: 'Atlanta, GA → Savannah, GA', date: '2026-06-20', pay: 284.50, vehicle: 'Sprinter Van', miles: 250 },
  { id: 'c004', route: 'Greensboro, NC → Durham, NC', date: '2026-06-18', pay: 117.60, vehicle: 'Sprinter Van', miles: 56 },
  { id: 'c005', route: 'Greenville, SC → Spartanburg, SC', date: '2026-06-15', pay: 89.40, vehicle: 'Sprinter Van', miles: 31 },
]

const weeklyEarnings = [
  { day: 'Mon', earnings: 215 },
  { day: 'Tue', earnings: 0 },
  { day: 'Wed', earnings: 284 },
  { day: 'Thu', earnings: 148 },
  { day: 'Fri', earnings: 320 },
  { day: 'Sat', earnings: 0 },
  { day: 'Sun', earnings: 0 },
]

export default function DriverPage() {
  const [isAvailable, setIsAvailable] = useState(true)
  const thisWeek = weeklyEarnings.reduce((s, d) => s + d.earnings, 0)
  const maxEarning = Math.max(...weeklyEarnings.map(d => d.earnings))

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Driver Header */}
        <Card className="bg-gradient-to-r from-slate-900 via-slate-900 to-orange-500/10 border-slate-800 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Avatar className="w-16 h-16 ring-2 ring-orange-500/50">
                <AvatarFallback className="bg-orange-500/20 text-orange-400 text-xl font-bold">
                  {driver.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h1 className="text-2xl font-bold text-white">{driver.name}</h1>
                  <Badge className={`${isAvailable ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                    <span className={`w-2 h-2 rounded-full mr-1.5 ${isAvailable ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                    {isAvailable ? 'Available' : 'Off Duty'}
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm mb-1">{driver.vehicleYear} {driver.vehicleMake} {driver.vehicleModel} · {driver.licensePlate}</p>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><Star className="h-4 w-4 text-orange-400 fill-orange-400" /> {driver.rating} rating</span>
                  <span className="flex items-center gap-1"><Package className="h-4 w-4" /> {driver.completedDeliveries} deliveries</span>
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {driver.currentCity}, {driver.currentState}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <Button
                  onClick={() => setIsAvailable(a => !a)}
                  variant="outline"
                  className={`border-slate-700 font-semibold gap-2 ${isAvailable ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-400 hover:text-white'}`}
                >
                  <Activity className="h-4 w-4" />
                  {isAvailable ? 'Set Offline' : 'Go Online'}
                </Button>
                <ShareModal />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'This Week', value: formatCurrency(thisWeek), icon: DollarSign, color: 'text-orange-400', sub: '5 deliveries' },
            { label: 'All-Time Earned', value: formatCurrency(driver.totalEarnings), icon: TrendingUp, color: 'text-emerald-400', sub: `${driver.completedDeliveries} total` },
            { label: 'Driver Rating', value: `${driver.rating}/5.0`, icon: Star, color: 'text-yellow-400', sub: 'Top rated' },
            { label: 'Available Loads', value: availableLoads.length, icon: Truck, color: 'text-blue-400', sub: 'Near you' },
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

        <Tabs defaultValue="available">
          <TabsList className="bg-slate-900 border border-slate-800 mb-6">
            <TabsTrigger value="available" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-slate-400">
              Available Loads ({availableLoads.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-slate-400">
              Delivery History
            </TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-slate-400">
              Earnings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm">Loads matching your <span className="text-purple-400 font-medium">Sprinter Van</span> in SC · NC · GA</p>
              <Link href="/opportunities">
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:text-white gap-2">
                  <Search className="h-4 w-4" />
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {availableLoads.map(d => <DeliveryCard key={d.id} delivery={d} />)}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-0">
                <div className="divide-y divide-slate-800">
                  {completedDeliveries.map((d, i) => (
                    <motion.div key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-4 hover:bg-slate-800/40 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{d.route}</p>
                        <p className="text-slate-500 text-xs">{d.date} · {d.miles} miles · {d.vehicle}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-emerald-400 font-bold">{formatCurrency(d.pay)}</p>
                        <p className="text-slate-600 text-xs">Paid</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Chart */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">This Week's Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-orange-400 mb-6">{formatCurrency(thisWeek)}</div>
                  <div className="flex items-end gap-2 h-32">
                    {weeklyEarnings.map(({ day, earnings }) => (
                      <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                        <div className="w-full bg-slate-800 rounded-t-md overflow-hidden" style={{ height: '100px' }}>
                          <div
                            className="w-full bg-orange-500 rounded-t-md transition-all duration-500"
                            style={{ height: maxEarning > 0 ? `${(earnings / maxEarning) * 100}%` : '0%' }}
                          />
                        </div>
                        <span className="text-slate-500 text-xs">{day}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Earnings Summary */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Earnings Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'This Week', value: formatCurrency(thisWeek), sub: '5 deliveries completed' },
                    { label: 'This Month', value: formatCurrency(3420), sub: '23 deliveries' },
                    { label: 'All Time', value: formatCurrency(driver.totalEarnings), sub: `${driver.completedDeliveries} deliveries` },
                    { label: 'Avg Per Delivery', value: formatCurrency(driver.totalEarnings / driver.completedDeliveries), sub: 'Lifetime average' },
                  ].map(({ label, value, sub }) => (
                    <div key={label} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <p className="text-white font-semibold">{value}</p>
                        <p className="text-slate-500 text-xs">{sub}</p>
                      </div>
                      <p className="text-slate-400 text-sm">{label}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
