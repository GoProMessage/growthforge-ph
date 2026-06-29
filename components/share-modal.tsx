"use client"

import { useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Share, Copy, CheckCircle, MessageSquare,
  Mail, Globe, Truck, DollarSign, Users, Phone,
} from "lucide-react"

interface ShareModalProps {
  trigger?: React.ReactNode
}

// Runs synchronously on the client — no useEffect needed
function buildShareData() {
  if (typeof window === "undefined") {
    return { refCode: "VROWNER1", referralUrl: "" }
  }
  let refCode = ""
  try {
    refCode = localStorage.getItem("vr_ref_code") || ""
    if (!refCode) {
      refCode = "VR" + Math.random().toString(36).substring(2, 7).toUpperCase()
      localStorage.setItem("vr_ref_code", refCode)
    }
  } catch {
    refCode = "VROWNER1"
  }
  const referralUrl = `${window.location.origin}/join?ref=${refCode}`
  return { refCode, referralUrl }
}

export function ShareModal({ trigger }: ShareModalProps) {
  // Lazy initializer — runs once synchronously on first client render
  const [shareData] = useState<{ refCode: string; referralUrl: string }>(buildShareData)
  const [copied, setCopied] = useState(false)

  const { refCode, referralUrl } = shareData

  // ── Pre-build every share href at render time ──────────────────────────────
  const waHref = referralUrl
    ? `https://wa.me/?text=${encodeURIComponent(
        `🚚 Check out VanRoute Pro — the #1 platform for cargo & sprinter van loads in SC, NC & GA.\n\n` +
        `✅ 25+ new loads daily  ✅ Earn $1,200+/week\n✅ Built-in GPS routing  ✅ Instant online pay\n\n` +
        `Join FREE with my referral link:\n${referralUrl}`
      )}`
    : "#"

  const emailHref = referralUrl
    ? `mailto:?subject=${encodeURIComponent(
        "Join me on VanRoute Pro — Logistics Owner Operators (SC · NC · GA)"
      )}&body=${encodeURIComponent(
        `Hi,\n\nI wanted to share VanRoute Pro — the best platform for cargo van & sprinter van ` +
        `owner-operators in SC, NC & GA.\n\n` +
        `What you get:\n` +
        `• 25+ new delivery loads every day\n` +
        `• $1,200+ average weekly earnings\n` +
        `• Built-in GPS routing (no app-switching)\n` +
        `• Scheduled delivery options\n` +
        `• Secure online payment\n\n` +
        `Join FREE — we both earn $50 on your first delivery:\n${referralUrl}\n\nHope to see you on the platform!`
      )}`
    : "#"

  const smsHref = referralUrl
    ? `sms:?body=${encodeURIComponent(
        `Hey! Join VanRoute Pro — find cargo & sprinter van loads in SC, NC & GA. ` +
        `Earn $1,200+/week. Join free: ${referralUrl}`
      )}`
    : "#"

  const handleCopy = () => {
    if (!referralUrl) return
    try {
      navigator.clipboard.writeText(referralUrl)
    } catch {
      const el = document.createElement("textarea")
      el.value = referralUrl
      el.style.cssText = "position:fixed;opacity:0;pointer-events:none"
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleNativeShare = async () => {
    if (!referralUrl) return
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "VanRoute Pro — Logistics Network",
          text: "Find cargo & sprinter van loads in SC, NC & GA. Earn $1,200+/week!",
          url: referralUrl,
        })
        return
      } catch { /* cancelled */ }
    }
    handleCopy()
  }

  const cls = (color: string) =>
    `flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-semibold transition-colors cursor-pointer select-none ${color}`

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 gap-2"
          >
            <Share className="h-4 w-4" />
            Share Platform
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Share className="h-5 w-5 text-orange-500" />
            Share VanRoute Pro
          </DialogTitle>
        </DialogHeader>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 my-3">
          {[
            { icon: Truck, label: "Active Drivers", value: "87+" },
            { icon: DollarSign, label: "Avg Earnings", value: "$1,200/wk" },
            { icon: Users, label: "Shippers", value: "344+" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-slate-800/60 rounded-lg p-3 text-center border border-slate-700">
              <Icon className="h-4 w-4 text-orange-400 mx-auto mb-1" />
              <p className="text-white font-bold text-sm">{value}</p>
              <p className="text-slate-500 text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* Referral bonus */}
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-orange-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-orange-300 font-semibold text-sm">Earn $50 Per Referral!</p>
              <p className="text-slate-400 text-xs mt-1">
                When someone joins with your link and completes their first delivery,
                you both receive a $50 bonus credit.
              </p>
            </div>
          </div>
        </div>

        {/* Referral link + copy */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm font-medium">Your Referral Link</p>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono text-xs">
              {refCode}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Input
              readOnly
              value={referralUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="bg-slate-800 border-slate-700 text-slate-300 text-xs font-mono cursor-text"
            />
            <Button
              type="button"
              onClick={handleCopy}
              className={`shrink-0 gap-2 transition-colors ${
                copied ? "bg-emerald-600 hover:bg-emerald-500" : "bg-orange-500 hover:bg-orange-400"
              }`}
            >
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        {/* Share buttons — pure <a> tags, no JS navigation, no popup blockers */}
        <div className="space-y-2">
          <p className="text-slate-400 text-sm font-medium">Share Via</p>
          <div className="flex flex-col gap-2">

            {/* WhatsApp — opens wa.me in new tab */}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cls("border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200")}
            >
              <MessageSquare className="h-4 w-4" />
              Share on WhatsApp
            </a>

            {/* Email — opens default mail client */}
            <a
              href={emailHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cls("border-blue-500/40 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200")}
            >
              <Mail className="h-4 w-4" />
              Share via Email
            </a>

            {/* SMS — mobile only, opens Messages app */}
            <a
              href={smsHref}
              className={cls("border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200")}
            >
              <Phone className="h-4 w-4" />
              <span>Share via Text / SMS</span>
              <span className="ml-auto text-xs opacity-50">mobile</span>
            </a>

            {/* Native share sheet (mobile) or copy fallback (desktop) */}
            <button
              type="button"
              onClick={handleNativeShare}
              className={cls("border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white")}
            >
              <Share className="h-4 w-4" />
              More Options
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
          <Globe className="h-3.5 w-3.5" />
          <span>South Carolina · North Carolina · Georgia · USA</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
