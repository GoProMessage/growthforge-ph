"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Truck, Menu, Home, Search, User, Settings,
  MapPin, Package, DollarSign, Share, BarChart3, Bell, RefreshCw
} from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/opportunities", label: "Live Board", icon: Search, live: true },
  { href: "/post-delivery", label: "Post Delivery", icon: Package },
  { href: "/recurring-routes", label: "Recurring", icon: RefreshCw },
  { href: "/driver", label: "Driver Portal", icon: Truck },
  { href: "/shipper", label: "Shipper Portal", icon: User },
  { href: "/admin", label: "Admin", icon: BarChart3 },
  { href: "/share", label: "Share & Earn", icon: Share },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [newCount, setNewCount] = useState(3)
  const [pulse, setPulse] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setNewCount(prev => prev + Math.floor(Math.random() * 2))
      setPulse(p => !p)
    }, 45000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-orange-500 p-1.5 rounded-lg group-hover:bg-orange-400 transition-colors">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">
              Van<span className="text-orange-500">Route</span>
            </span>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs hidden sm:flex">PRO</Badge>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-orange-500/20 text-orange-400"
                    : item.href === "/share"
                      ? "text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 border border-orange-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.live && (
                  <span className="flex items-center gap-1">
                    <span className={cn("inline-block w-1.5 h-1.5 rounded-full bg-emerald-500", pulse && "animate-pulse")} />
                    <span className="text-xs text-emerald-400 font-semibold">LIVE</span>
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link href="/opportunities" className="hidden sm:flex">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-400 text-white font-semibold gap-2 relative">
                <Search className="h-4 w-4" />
                Find Loads
                {newCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {newCount > 9 ? '9+' : newCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-slate-950 border-slate-800 w-72">
                <div className="flex items-center gap-2 mb-8 mt-2">
                  <div className="bg-orange-500 p-1.5 rounded-lg">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-xl text-white">Van<span className="text-orange-500">Route</span></span>
                </div>
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-orange-500/20 text-orange-400"
                          : item.href === "/share"
                            ? "text-orange-300 hover:text-orange-200 hover:bg-orange-500/10"
                            : "text-slate-300 hover:text-white hover:bg-slate-800"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                      {item.live && <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs ml-auto">LIVE</Badge>}
                      {item.href === "/share" && <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs ml-auto">$50</Badge>}
                    </Link>
                  ))}
                </nav>
                <div className="mt-8 pt-6 border-t border-slate-800 space-y-2">
                  <Link href="/opportunities" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold gap-2">
                      <Search className="h-4 w-4" />
                      Find Loads Now
                    </Button>
                  </Link>
                  <Link href="/share" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10 gap-2">
                      <Share className="h-4 w-4" />
                      Share & Earn $50
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
