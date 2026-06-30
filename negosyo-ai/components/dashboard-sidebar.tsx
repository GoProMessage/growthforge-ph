"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3, Search, FileText, Globe, Users, CreditCard,
  Settings, LogOut, TrendingUp, Zap, Shield
} from "lucide-react"

const navItems = [
  { href: "/dashboard", icon: BarChart3, label: "Dashboard", exact: true },
  { href: "/dashboard/seo-audit", icon: Search, label: "SEO Audit", badge: "HOT" },
  { href: "/dashboard/content", icon: FileText, label: "AI Content" },
  { href: "/dashboard/website", icon: Globe, label: "Website Builder" },
  { href: "/dashboard/clients", icon: Users, label: "Clients" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-5 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-white">NegosyoAI</span>
            <p className="text-xs text-gray-400">Business Suite</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2 mt-1">Menu</p>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                active
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge className="bg-amber-500 text-amber-950 border-0 text-[10px] h-4 px-1.5 font-bold">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}

        {/* Upgrade CTA */}
        <div className="mt-4 mx-1 p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border border-primary/20">
          <TrendingUp className="w-5 h-5 text-primary mb-2" />
          <p className="text-xs font-semibold text-white mb-1">Upgrade to Pro</p>
          <p className="text-xs text-gray-400 mb-3">Unlock unlimited tools & white-label</p>
          <Link
            href="/dashboard/billing"
            className="block text-center text-xs font-bold py-1.5 px-3 bg-primary rounded-lg text-white hover:bg-primary/90 transition-colors"
          >
            Upgrade Now
          </Link>
        </div>
      </nav>

      {/* Admin Panel Link */}
      <div className="px-3 pb-2">
        <Link
          href="/admin"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-violet-950 hover:bg-violet-900 text-violet-300 hover:text-white transition-all border border-violet-800"
        >
          <Shield className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium flex-1">Admin Panel</span>
          <Badge className="bg-amber-500 text-amber-950 border-0 text-[10px] h-4 px-1.5 font-black">
            ADMIN
          </Badge>
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            J
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Juan dela Cruz</p>
            <p className="text-xs text-gray-400">Growth Plan</p>
          </div>
          <Link href="/">
            <LogOut className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
