"use client"

import { useState, useEffect, useRef } from "react"
import { Shield, Eye, EyeOff, Lock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// ── Change this to your desired admin PIN ─────────────────────────────────
const ADMIN_PIN = "VRPRO2024"
const SESSION_KEY = "vrpro_admin_auth"
// ──────────────────────────────────────────────────────────────────────────

interface AdminGateProps {
  children: React.ReactNode
}

export function AdminGate({ children }: AdminGateProps) {
  const [authed, setAuthed] = useState<boolean | null>(null)  // null = loading
  const [pin, setPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked] = useState(false)
  const [lockSeconds, setLockSeconds] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Check session on mount
  useEffect(() => {
    try {
      const auth = sessionStorage.getItem(SESSION_KEY)
      setAuthed(auth === "true")
    } catch {
      setAuthed(false)
    }
  }, [])

  // Lockout countdown
  useEffect(() => {
    if (!locked) return
    if (lockSeconds <= 0) { setLocked(false); return }
    const t = setTimeout(() => setLockSeconds(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [locked, lockSeconds])

  // Focus input when gate shows
  useEffect(() => {
    if (authed === false) setTimeout(() => inputRef.current?.focus(), 100)
  }, [authed])

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (locked) return

    if (pin.trim().toUpperCase() === ADMIN_PIN.toUpperCase()) {
      try { sessionStorage.setItem(SESSION_KEY, "true") } catch { /**/ }
      setAuthed(true)
      setError("")
    } else {
      const next = attempts + 1
      setAttempts(next)
      setPin("")
      if (next >= 3) {
        setLocked(true)
        setLockSeconds(30)
        setError("Too many attempts. Locked for 30 seconds.")
      } else {
        setError(`Incorrect PIN. ${3 - next} attempt${3 - next > 1 ? "s" : ""} remaining.`)
      }
    }
  }

  function handleLogout() {
    try { sessionStorage.removeItem(SESSION_KEY) } catch { /**/ }
    setAuthed(false)
    setPin("")
    setError("")
    setAttempts(0)
    setLocked(false)
  }

  // Still loading session
  if (authed === null) return null

  // Authenticated — render children with a logout button
  if (authed) {
    return (
      <div>
        {children}
        {/* Floating logout button */}
        <button
          onClick={handleLogout}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg transition-colors"
        >
          <Lock className="h-3.5 w-3.5" />
          Lock Admin
        </button>
      </div>
    )
  }

  // PIN gate
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-500/20 border border-orange-500/30 mb-4">
            <Shield className="h-10 w-10 text-orange-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Admin Access</h1>
          <p className="text-slate-400 text-sm mt-2">VanRoute Pro — Restricted Area</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">Admin PIN</label>
              <div className="relative">
                <Input
                  ref={inputRef}
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={e => { setPin(e.target.value); setError("") }}
                  placeholder="Enter your admin PIN"
                  disabled={locked}
                  autoComplete="off"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 pr-10 text-center text-lg tracking-widest font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  tabIndex={-1}
                >
                  {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {locked ? `Locked — try again in ${lockSeconds}s` : error}
              </div>
            )}

            <Button
              type="submit"
              disabled={locked || !pin.trim()}
              className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold h-12 text-base gap-2"
            >
              <Shield className="h-4 w-4" />
              {locked ? `Locked (${lockSeconds}s)` : "Access Admin Dashboard"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-slate-600 text-xs">
              Only authorized VanRoute Pro administrators can access this area.
              <br />Contact the platform owner to request access.
            </p>
          </div>
        </div>

        {/* Hint (remove in production) */}
        <div className="mt-4 text-center">
          <p className="text-slate-700 text-xs">
            Default PIN: <span className="font-mono text-slate-600">VRPRO2024</span>
            {" "}— change in <code className="text-slate-700">components/admin-gate.tsx</code>
          </p>
        </div>
      </div>
    </div>
  )
}
