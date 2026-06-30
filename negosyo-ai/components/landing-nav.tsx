"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap } from "lucide-react"

export function LandingNav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-blue-600">Negosyo</span>
            <span className="text-amber-500">AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Calculator</Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Stories</Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link>
            <Link href="/signup">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200">
                Start Free Trial
              </Button>
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-b px-4 py-4 space-y-3">
          <Link href="#features" className="block text-sm text-muted-foreground py-1" onClick={() => setOpen(false)}>Features</Link>
          <Link href="#pricing" className="block text-sm text-muted-foreground py-1" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="#testimonials" className="block text-sm text-muted-foreground py-1" onClick={() => setOpen(false)}>Stories</Link>
          <Link href="/login" className="block text-sm text-muted-foreground py-1" onClick={() => setOpen(false)}>Login</Link>
          <Link href="/signup" onClick={() => setOpen(false)}>
            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">Start Free Trial</Button>
          </Link>
        </div>
      )}
    </nav>
  )
}
