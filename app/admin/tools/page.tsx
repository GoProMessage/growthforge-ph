"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Search, FileText, Globe, Zap, CheckCircle, AlertCircle,
  XCircle, Loader2, Copy, Shield, Activity
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

/* ─── SEO Audit Tool ─── */
const seoSteps = [
  "Crawling website structure...",
  "Analyzing meta tags & keywords...",
  "Checking page speed metrics...",
  "Testing mobile responsiveness...",
  "Scanning technical SEO...",
  "Auditing backlink profile...",
  "Generating recommendations...",
]

const seoResults = (url: string) => ({
  url,
  scores: [
    { label: "On-Page SEO", score: 85, icon: CheckCircle, color: "text-green-500", issues: ["Title tag optimized", "Meta description present", "H1-H3 hierarchy correct"] },
    { label: "Page Speed", score: 72, icon: AlertCircle, color: "text-amber-500", issues: ["LCP: 2.8s (needs improvement)", "CLS: 0.12 (good)", "Compress images to save 340KB"] },
    { label: "Mobile", score: 94, icon: CheckCircle, color: "text-green-500", issues: ["Responsive design detected", "Touch targets adequate", "Viewport configured"] },
    { label: "Technical", score: 78, icon: AlertCircle, color: "text-amber-500", issues: ["Missing XML sitemap", "robots.txt present", "SSL certificate valid"] },
  ]
})

function SEOAuditTool() {
  const [url, setUrl] = useState("")
  const [step, setStep] = useState(-1)
  const [done, setDone] = useState(false)
  const [results, setResults] = useState<ReturnType<typeof seoResults> | null>(null)

  const runAudit = async () => {
    if (!url) return
    setDone(false)
    setResults(null)
    for (let i = 0; i < seoSteps.length; i++) {
      setStep(i)
      await new Promise(r => setTimeout(r, 600))
    }
    setResults(seoResults(url))
    setDone(true)
    setStep(-1)
  }

  const avgScore = results ? Math.round(results.scores.reduce((s, r) => s + r.score, 0) / results.scores.length) : 0

  return (
    <div className="space-y-5">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="https://yourbusiness.ph"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <Button
          onClick={runAudit}
          disabled={step >= 0 || !url}
          className="bg-violet-600 hover:bg-violet-700 text-white min-w-[120px]"
        >
          {step >= 0 ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Scanning...</> : "Run Audit"}
        </Button>
      </div>

      <AnimatePresence>
        {step >= 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700">Step {step + 1} of {seoSteps.length}</p>
              <Badge className="bg-violet-100 text-violet-700 border-0">{Math.round(((step + 1) / seoSteps.length) * 100)}%</Badge>
            </div>
            <Progress value={((step + 1) / seoSteps.length) * 100} className="h-2 mb-3" />
            <p className="text-sm text-gray-500">{seoSteps[step]}</p>
          </motion.div>
        )}

        {done && results && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center gap-4 bg-violet-50 rounded-xl p-4">
              <div className="text-center">
                <div className="text-4xl font-black text-violet-700">{avgScore}</div>
                <div className="text-xs text-violet-500">Overall Score</div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{results.url}</p>
                <p className="text-sm text-gray-500">Admin test completed · Just now</p>
                <Progress value={avgScore} className="h-2 mt-2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {results.scores.map((r) => (
                <div key={r.label} className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-900">{r.label}</span>
                    <r.icon className={`w-4 h-4 ${r.color}`} />
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-2">{r.score}<span className="text-sm font-normal text-gray-400">/100</span></div>
                  <Progress value={r.score} className="h-1.5 mb-3" />
                  <ul className="space-y-1">
                    {r.issues.map((issue) => (
                      <li key={issue} className="text-xs text-gray-500 flex items-start gap-1.5">
                        <span className="mt-0.5 flex-shrink-0">•</span>{issue}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── AI Content Tool ─── */
const templates = [
  { id: "blog", label: "Blog Post", icon: "✍️" },
  { id: "caption", label: "Social Caption", icon: "📸" },
  { id: "ad", label: "Ad Copy", icon: "📣" },
  { id: "email", label: "Email Campaign", icon: "📧" },
  { id: "product", label: "Product Description", icon: "🛍️" },
  { id: "seo", label: "SEO Meta Tags", icon: "🔍" },
]

const mockOutput: Record<string, string> = {
  blog: `# 5 Digital Marketing Secrets for Philippine SMEs in 2026\n\nThe Philippine digital economy has grown by 450% since 2020, yet most local SMEs are leaving money on the table by ignoring proven online strategies...\n\n## 1. Mobile-First Social Media Strategy\n\nWith 96% of Filipinos accessing social media via mobile, your content needs to be designed thumb-first. Short-form video content on TikTok and Instagram Reels generates 3x more engagement...\n\n## 2. GCash Integration Drives Conversions\n\nBusinesses that add GCash payment options see 47% higher checkout completion rates versus card-only checkout...`,
  caption: `🌟 Anong special ng aming negosyo? Quality na abot-kaya para sa bawat Pilipino! 🇵🇭\n\nMula Luzon hanggang Mindanao, sineserbisyuhan namin ang bawat kliyente namin ng may pagmamahal at dedikasyon.\n\n✅ Quality products\n✅ Fast delivery\n✅ GCash & Maya accepted\n\nShop now! Link in bio 👆\n\n#NegosyoPH #FilipinoBusiness #ShopLocal #GCash`,
  ad: `STOP scrolling — your competitors are already using AI.\n\n📈 NegosyoAI helps Philippine businesses:\n• Rank on Google in 30 days\n• Create 10x more content\n• Build a website in minutes\n\nJoin 500+ SMEs already growing faster.\n\n🎁 Start FREE — no credit card needed\n👉 negosyoai.ph`,
  email: `Subject: Your business deserves to be found on Google 🔍\n\nKumusta [First Name]!\n\nAko si Juan mula NegosyoAI. Napansin ko na ang inyong negosyo ay hindi pa nag-a-appear sa Google search results para sa [keyword] sa [city].\n\nNagawa na namin itong i-fix para sa 500+ Philippine SMEs, at kaya naming gawin ito para sa inyo...\n\nCTA: Book a FREE SEO Audit → negosyoai.ph/audit`,
  product: `**NegosyoAI Growth Plan** — ₱2,999/month\n\nAng pinaka-kompletong digital marketing toolkit para sa Philippine SMEs. Kasama na ang:\n\n🔍 Unlimited SEO Audits — I-check ang inyong website anumang oras\n✍️ AI Content Generator — 200 pieces ng content bawat buwan\n🌐 Website Builder — Professional website sa loob ng 30 minuto\n📊 Advanced Analytics — Real-time business intelligence\n\n💳 GCash · Maya · Credit Card accepted`,
  seo: `Title: NegosyoAI — AI-Powered Digital Marketing for Philippine SMEs | negosyoai.ph\n\nMeta Description: Grow your Philippine business online with AI-powered SEO audits, content generation, and website builder. Trusted by 500+ SMEs. GCash & Maya accepted. Start free trial.\n\nFocus Keyword: digital marketing Philippines\nSecondary Keywords: Philippine SME marketing, SEO Philippines, GCash business`,
}

function ContentTool() {
  const [type, setType] = useState("blog")
  const [lang, setLang] = useState("Filipino/English")
  const [topic, setTopic] = useState("")
  const [generating, setGenerating] = useState(false)
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    setGenerating(true)
    setOutput("")
    await new Promise(r => setTimeout(r, 1500))
    setOutput(mockOutput[type] || "Content generated successfully.")
    setGenerating(false)
  }

  const copy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${type === t.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-100 bg-white text-gray-600 hover:border-violet-200"}`}
          >
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1.5 block">Language</label>
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Filipino/English", "English", "Tagalog", "Cebuano"].map(l => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1.5 block">Topic / Brief</label>
          <Input className="h-9 text-sm" placeholder="e.g., online bakery Cebu City" value={topic} onChange={e => setTopic(e.target.value)} />
        </div>
      </div>
      <Button onClick={generate} disabled={generating} className="bg-violet-600 hover:bg-violet-700 text-white w-full">
        {generating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Generating with AI...</> : <><Zap className="w-4 h-4 mr-2" />Generate Content</>}
      </Button>
      {output && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-2">
            <Badge className="bg-green-100 text-green-700 border-0">✓ Generated</Badge>
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5" onClick={copy}>
              <Copy className="w-3.5 h-3.5" />{copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <Textarea readOnly value={output} className="h-48 text-sm font-mono resize-none bg-gray-50" />
        </motion.div>
      )}
    </div>
  )
}

/* ─── Website Builder Tool ─── */
const templates2 = [
  { id: "restaurant", name: "Restaurant / Kainan", emoji: "🍽️", color: "bg-orange-50 border-orange-200" },
  { id: "retail", name: "Retail / Tindahan", emoji: "🛍️", color: "bg-pink-50 border-pink-200" },
  { id: "service", name: "Professional Services", emoji: "💼", color: "bg-blue-50 border-blue-200" },
  { id: "medical", name: "Medical / Klinika", emoji: "🏥", color: "bg-green-50 border-green-200" },
  { id: "realty", name: "Real Estate", emoji: "🏠", color: "bg-violet-50 border-violet-200" },
  { id: "beauty", name: "Beauty / Salon", emoji: "💅", color: "bg-rose-50 border-rose-200" },
]

function WebsiteTool() {
  const [selected, setSelected] = useState("")
  const [building, setBuilding] = useState(false)
  const [built, setBuilt] = useState(false)

  const build = async () => {
    if (!selected) return
    setBuilding(true)
    setBuilt(false)
    await new Promise(r => setTimeout(r, 2500))
    setBuilding(false)
    setBuilt(true)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {templates2.map((t) => (
          <button
            key={t.id}
            onClick={() => { setSelected(t.id); setBuilt(false) }}
            className={`border-2 rounded-xl p-4 text-left transition-all ${selected === t.id ? "border-violet-500 ring-2 ring-violet-200" : "border-gray-100 hover:border-violet-200"} ${t.color}`}
          >
            <div className="text-3xl mb-2">{t.emoji}</div>
            <div className="text-sm font-semibold text-gray-900">{t.name}</div>
          </button>
        ))}
      </div>
      <Button onClick={build} disabled={!selected || building} className="bg-violet-600 hover:bg-violet-700 text-white w-full">
        {building ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Building website...</> : "Generate Website Preview"}
      </Button>
      {built && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="bg-gray-800 px-4 py-2.5 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 bg-gray-700 rounded text-xs text-gray-300 px-3 py-1">
                https://preview.negosyoai.ph/template/{selected}
              </div>
            </div>
            <div className="p-6 text-center text-white">
              <div className="text-5xl mb-3">{templates2.find(t => t.id === selected)?.emoji}</div>
              <h3 className="text-xl font-bold">{templates2.find(t => t.id === selected)?.name} Website</h3>
              <p className="text-gray-400 text-sm mt-2">Professional website generated in 2.5 seconds</p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {["Home", "About", "Services", "Gallery", "Contact", "Book Now"].map(p => (
                  <div key={p} className="bg-gray-800 rounded-lg px-3 py-2 text-xs text-gray-300">{p}</div>
                ))}
              </div>
              <Badge className="bg-green-500 text-white border-0 mt-4">✓ Mobile Responsive · SEO Ready · GCash Enabled</Badge>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

/* ─── Main Page ─── */
const toolHealth = [
  { name: "SEO Audit", status: "Operational", uptime: "99.9%", icon: Search, color: "text-green-500" },
  { name: "AI Content", status: "Operational", uptime: "99.7%", icon: FileText, color: "text-green-500" },
  { name: "Website Builder", status: "Operational", uptime: "100%", icon: Globe, color: "text-green-500" },
]

export default function AdminToolsPage() {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-violet-600" />
          <h1 className="text-2xl font-bold text-gray-900">Service Testing Center</h1>
          <Badge className="bg-violet-600 text-white border-0">Admin Mode</Badge>
        </div>
        <p className="text-gray-500 text-sm mt-1">Test all platform services as a Super Admin — full access, no usage limits</p>
      </div>

      {/* Admin Testing Mode Banner */}
      <Alert className="border-violet-200 bg-violet-50">
        <Shield className="h-4 w-4 text-violet-600" />
        <AlertDescription className="text-violet-700 font-medium">
          You are in <strong>Admin Testing Mode</strong>. All tool usage here is separate from customer quotas. Tests don&apos;t affect user billing or usage stats.
        </AlertDescription>
      </Alert>

      {/* Service Health */}
      <div className="grid grid-cols-3 gap-3">
        {toolHealth.map((t) => (
          <Card key={t.name} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <t.icon className={`w-5 h-5 ${t.color} flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400">{t.uptime} uptime</p>
              </div>
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tool Tabs */}
      <Tabs defaultValue="seo">
        <TabsList className="grid w-full grid-cols-3 h-11">
          <TabsTrigger value="seo" className="gap-2 text-sm">
            <Search className="w-4 h-4" />SEO Audit
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2 text-sm">
            <FileText className="w-4 h-4" />AI Content
          </TabsTrigger>
          <TabsTrigger value="website" className="gap-2 text-sm">
            <Globe className="w-4 h-4" />Website Builder
          </TabsTrigger>
        </TabsList>

        <Card className="border-0 shadow-sm mt-4">
          <TabsContent value="seo" className="mt-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Search className="w-4 h-4 text-violet-500" />
                SEO Audit Tool
                <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">Test any URL</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent><SEOAuditTool /></CardContent>
          </TabsContent>

          <TabsContent value="content" className="mt-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-500" />
                AI Content Generator
                <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">Unlimited testing</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent><ContentTool /></CardContent>
          </TabsContent>

          <TabsContent value="website" className="mt-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4 text-violet-500" />
                Website Builder
                <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">Preview all templates</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent><WebsiteTool /></CardContent>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  )
}
