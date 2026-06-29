"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Share, Copy, CheckCircle, MessageSquare,
  Mail, Phone, Globe, Truck, DollarSign,
  Users, ArrowLeft, ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

function buildShareData() {
  if (typeof window === "undefined") return { refCode: "VROWNER1", referralUrl: "" }
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
  return { refCode, referralUrl: `${window.location.origin}/join?ref=${refCode}` }
}

export default function SharePage() {
  const [shareData] = useState<{ refCode: string; referralUrl: string }>(buildShareData)
  const [copied, setCopied] = useState(false)

  const { refCode, referralUrl } = shareData

  const waHref = referralUrl
    ? `https://wa.me/?text=${encodeURIComponent(
        `🚚 Check out VanRoute Pro — the #1 platform for cargo & sprinter van loads in SC, NC & GA.\n\n` +
        `✅ 25+ new loads daily  ✅ Earn $1,200+/week\n✅ Built-in GPS routing  ✅ Instant pay\n\n` +
        `Join FREE with my referral link:\n${referralUrl}`
      )}`
    : "#"

  const emailHref = referralUrl
    ? `mailto:?subject=${encodeURIComponent("Join me on VanRoute Pro — Logistics Owner Operators (SC · NC · GA)")}&body=${encodeURIComponent(
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
    try { navigator.clipboard.writeText(referralUrl) } catch {
      const el = Object.assign(document.createElement("textarea"), {
        value: referralUrl,
        style: "position:fixed;opacity:0",
      })
      document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const shareBtn = (href: string, extra: React.AnchorHTMLAttributes<HTMLAnchorElement>, icon: React.ReactNode, label: string, sub?: string, color?: string) => (
    <a
      href={href}
      {...extra}
      className={`flex items-center gap-3 rounded-xl border px-5 py-4 text-sm font-semibold transition-all ${color}`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      {sub && <span className="text-xs opacity-50">{sub}</span>}
      <ExternalLink className="h-3.5 w-3.5 opacity-40" />
    </a>
  )

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-xl mx-auto px-4 py-10 space-y-8">

        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/30 mb-2">
            <Share className="h-7 w-7 text-orange-400" />
          </div>
          <h1 className="text-3xl font-extrabold">Share VanRoute Pro</h1>
          <p className="text-slate-400">Grow the network — earn $50 per driver you refer</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Truck, label: "Drivers", value: "87+" },
            { icon: DollarSign, label: "Avg/Week", value: "$1,200" },
            { icon: Users, label: "Shippers", value: "344+" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-slate-800/60 rounded-xl p-4 text-center border border-slate-700">
              <Icon className="h-5 w-5 text-orange-400 mx-auto mb-1.5" />
              <p className="text-white font-bold">{value}</p>
              <p className="text-slate-500 text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* Referral bonus */}
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <DollarSign className="h-6 w-6 text-orange-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-orange-300 font-bold">Earn $50 Per Referral!</p>
              <p className="text-slate-400 text-sm mt-1">
                When someone joins using your link and completes their first delivery,
                you both receive a $50 bonus credit.
              </p>
            </div>
          </div>
        </div>

        {/* Referral link */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-slate-300 font-semibold">Your Referral Link</p>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono text-xs">
              {refCode}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Input
              readOnly
              value={referralUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="bg-slate-800 border-slate-700 text-slate-300 text-xs font-mono"
            />
            <Button
              type="button"
              onClick={handleCopy}
              className={`shrink-0 gap-2 font-semibold ${copied ? "bg-emerald-600 hover:bg-emerald-500" : "bg-orange-500 hover:bg-orange-400"}`}
            >
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <p className="text-slate-500 text-xs text-center">
            Click the link above to select it, then copy manually if the button doesn&apos;t work
          </p>
        </div>

        {/* Share buttons */}
        <div className="space-y-3">
          <p className="text-slate-300 font-semibold">Send Your Link</p>

          {shareBtn(
            waHref,
            { target: "_blank", rel: "noopener noreferrer" },
            <MessageSquare className="h-5 w-5 text-emerald-400" />,
            "Share on WhatsApp",
            undefined,
            "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/50"
          )}

          {shareBtn(
            emailHref,
            { target: "_blank", rel: "noopener noreferrer" },
            <Mail className="h-5 w-5 text-blue-400" />,
            "Share via Email",
            undefined,
            "border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/50"
          )}

          {shareBtn(
            smsHref,
            {},
            <Phone className="h-5 w-5 text-purple-400" />,
            "Share via Text Message",
            "mobile only",
            "border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400/50"
          )}
        </div>

        {/* Manual copy section */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-5 space-y-3">
          <p className="text-slate-300 font-semibold text-sm">Pre-Written Message (copy &amp; paste)</p>
          <div className="bg-slate-900 rounded-lg p-4 text-xs text-slate-400 leading-relaxed select-all whitespace-pre-line border border-slate-700">
            {`🚚 Check out VanRoute Pro!

Find cargo & sprinter van loads in SC, NC & GA.
✅ 25+ new loads daily
✅ Earn $1,200+/week
✅ Built-in GPS routing
✅ Instant online pay

Join FREE: ${referralUrl}`}
          </div>
          <p className="text-slate-500 text-xs">Click the text above to select all, then copy</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-600 pb-4">
          <Globe className="h-3.5 w-3.5" />
          <span>South Carolina · North Carolina · Georgia · USA</span>
        </div>
      </div>
    </div>
  )
}
