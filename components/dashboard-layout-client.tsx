"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { TrialBanner } from "@/components/trial-banner"

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Auto-close mobile sidebar on navigation
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:block flex-shrink-0">
        <DashboardSidebar />
      </div>

      {/* Main content column */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={() => setOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 font-bold text-white">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-blue-400">Negosyo</span>
            <span className="text-amber-400">AI</span>
          </div>
        </header>

        {/* Trial countdown banner — shown on all dashboard pages */}
        <TrialBanner />

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile slide-out drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 border-0 bg-gray-900">
          <DashboardSidebar />
        </SheetContent>
      </Sheet>
    </div>
  )
}
