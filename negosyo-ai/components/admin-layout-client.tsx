"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, Shield } from "lucide-react"
import { AdminSidebar } from "./admin-sidebar"

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close drawer on navigation
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden lg:block flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Content column */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar — violet theme to match admin */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-violet-950 border-b border-violet-900">
          <Button
            variant="ghost"
            size="icon"
            className="text-violet-300 hover:text-white hover:bg-violet-800 h-8 w-8 flex-shrink-0"
            onClick={() => setOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-sm">NegosyoAI</span>
          </div>
          <div className="flex-1" />
          <Badge className="bg-amber-500 text-amber-950 border-0 text-[10px] px-1.5 font-black">ADMIN</Badge>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      {/* Mobile slide-out drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 border-0 bg-violet-950 [&>button]:text-violet-400 [&>button]:hover:text-white">
          <AdminSidebar />
        </SheetContent>
      </Sheet>
    </div>
  )
}
