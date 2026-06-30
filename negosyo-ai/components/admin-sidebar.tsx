"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3, Users, DollarSign, Zap, Activity,
  Settings, Shield, LogOut, ArrowLeft
} from "lucide-react"

const navItems = [
  { href: "/admin", icon: BarChart3, label: "Platform Overview", exact: true },
  { href: "/admin/users", icon: Users, label: "Users & Clients" },
  { href: "/admin/revenue", icon: DollarSign, label: "Revenue" },
  { href: "/admin/tools", icon: Zap, label: "Test All Services", badge: "LIVE" },
  { href: "/admin/activity", icon: Activity, label: "Live Activity" },
  { href: "/admin/settings", icon: Settings, label: "Platform Settings" },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <aside className="w-64 bg-violet-950 text-white flex flex-col min-h-screen border-r border-violet-900">
      {/* Logo + Badge */}
      <div className="p-5 border-b border-violet-800 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold leading-tight">NegosyoAI</div>
            <Badge className="bg-amber-500 text-amber-950 border-0 text-[10px] h-4 px-1.5 font-black tracking-wide">
              ADMIN PANEL
            </Badge>
          </div>
        </div>
        {/* System status */}
        <div className="flex items-center gap-2 bg-violet-900/60 rounded-lg px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          <span className="text-xs text-violet-300">All systems operational</span>
        </div>
        {/* Live stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Users", value: "156" },
            { label: "Active", value: "89" },
            { label: "Online", value: "12" },
          ].map((s) => (
            <div key={s.label} className="bg-violet-900/40 rounded-lg py-1.5">
              <div className="text-xs font-bold text-white">{s.value}</div>
              <div className="text-[10px] text-violet-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                active
                  ? "bg-violet-600 text-white shadow-md shadow-violet-900/60"
                  : "text-violet-300 hover:bg-violet-800/60 hover:text-white"
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge className="bg-green-500 text-white border-0 text-[10px] h-4 px-1.5 font-bold">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 space-y-2 border-t border-violet-800">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 text-sm text-violet-300 hover:text-white transition-colors rounded-xl hover:bg-violet-800/60"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-semibold truncate">Admin</p>
            <p className="text-xs text-violet-400">Super Administrator</p>
          </div>
          <Link href="/">
            <LogOut className="w-4 h-4 text-violet-400 hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
