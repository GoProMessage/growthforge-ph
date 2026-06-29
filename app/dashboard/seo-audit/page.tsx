"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, CheckCircle, AlertCircle, XCircle, Globe, Loader2, Download, Share } from "lucide-react"

interface Finding {
  item: string
  status: "good" | "warning" | "error"
  detail: string
}

interface AuditCategory {
  category: string
  score: number
  status: "good" | "warning" | "error"
  findings: Finding[]
}

const mockResults: AuditCategory[] = [
  {
    category: "On-Page SEO",
    score: 85,
    status: "good",
    findings: [
      { item: "Title Tag", status: "good", detail: "Optimized title found (58 chars). Includes primary keyword." },
      { item: "Meta Description", status: "warning", detail: "Meta description is too short (92 chars). Aim for 150–160 characters." },
      { item: "H1 Tag", status: "good", detail: "One H1 tag found with target keyword in natural position." },
      { item: "Keyword Density", status: "good", detail: "Keyword density at 2.1% — within optimal range (1–3%)." },
      { item: "Alt Text on Images", status: "warning", detail: "3 of 8 images are missing alt text. Add descriptive alt text for SEO." },
    ],
  },
  {
    category: "Page Speed",
    score: 72,
    status: "warning",
    findings: [
      { item: "Load Time", status: "warning", detail: "Page loads in 3.2 seconds. Target under 2s for better ranking." },
      { item: "Image Optimization", status: "error", detail: "5 uncompressed images found. Potential savings of 1.2MB (62% reduction)." },
      { item: "Browser Caching", status: "good", detail: "Cache headers configured correctly. Resources cached for 7 days." },
      { item: "CSS/JS Minification", status: "warning", detail: "2 CSS files and 1 JS file are not minified. Could save 45KB." },
      { item: "Core Web Vitals", status: "warning", detail: "LCP: 3.1s (needs improvement), FID: 18ms (good), CLS: 0.05 (good)." },
    ],
  },
  {
    category: "Mobile Friendliness",
    score: 94,
    status: "good",
    findings: [
      { item: "Responsive Design", status: "good", detail: "Layout adapts correctly to all screen sizes (320px–1920px)." },
      { item: "Viewport Meta Tag", status: "good", detail: "Correct viewport meta tag detected." },
      { item: "Touch Targets", status: "good", detail: "All clickable elements are at least 48×48px — mobile friendly." },
      { item: "Font Size", status: "warning", detail: "2 paragraphs use font-size below 14px on mobile. Increase for readability." },
    ],
  },
  {
    category: "Technical SEO",
    score: 78,
    status: "warning",
    findings: [
      { item: "SSL Certificate", status: "good", detail: "HTTPS enabled with valid certificate (expires in 287 days)." },
      { item: "XML Sitemap", status: "good", detail: "Sitemap found at /sitemap.xml and submitted to Google Search Console." },
      { item: "Robots.txt", status: "good", detail: "Robots.txt properly configured — no important pages blocked." },
      { item: "Broken Links", status: "error", detail: "3 broken internal links detected. Fix or redirect these URLs." },
      { item: "Duplicate Meta Descriptions", status: "warning", detail: "2 pages share the same meta description. Make each unique." },
      { item: "Schema Markup", status: "warning", detail: "No structured data found. Add Schema.org markup to improve rich results." },
    ],
  },
]

export default function SEOAuditPage() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState("")
  const [loadingPct, setLoadingPct] = useState(0)
  const [results, setResults] = useState<AuditCategory[] | null>(null)

  const loadingSteps = [
    "Connecting to website...",
    "Crawling page structure...",
    "Analyzing on-page SEO...",
    "Testing page speed...",
    "Checking mobile friendliness...",
    "Running technical audit...",
    "Generating report...",
  ]

  const runAudit = async () => {
    if (!url.trim()) return
    setLoading(true)
    setResults(null)

    for (let i = 0; i < loadingSteps.length; i++) {
      setLoadingStep(loadingSteps[i])
      setLoadingPct(Math.round(((i + 1) / loadingSteps.length) * 100))
      await new Promise((r) => setTimeout(r, 500))
    }

    setResults(mockResults)
    setLoading(false)
  }

  const overallScore = results
    ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)
    : 0

  const getStatusIcon = (status: "good" | "warning" | "error") => {
    if (status === "good") return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
    if (status === "warning") return <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
    return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">SEO Audit Tool</h1>
        <p className="text-muted-foreground">Get a detailed SEO score for any website with actionable recommendations</p>
      </div>

      {/* URL Input */}
      <Card className="border-border/60">
        <CardContent className="p-5">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="https://your-website.com or your-client-site.ph"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runAudit()}
                className="pl-10 h-11"
              />
            </div>
            <Button
              onClick={runAudit}
              disabled={loading || !url.trim()}
              className="bg-blue-600 hover:bg-blue-700 h-11 px-6 gap-2 shadow-md shadow-blue-100"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? "Analyzing..." : "Run Audit"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 ml-1">
            Try: <button className="text-blue-600 hover:underline" onClick={() => setUrl("https://santos-bakery.ph")}>santos-bakery.ph</button>
          </p>
        </CardContent>
      </Card>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
                  <p className="text-sm font-medium text-blue-700">{loadingStep}</p>
                  <span className="ml-auto text-sm font-bold text-blue-600">{loadingPct}%</span>
                </div>
                <Progress value={loadingPct} className="h-2" />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {results && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Overall Score */}
            <Card className="bg-gray-900 text-white border-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <p className="text-gray-300 text-sm mb-2">SEO Score for <span className="text-white font-medium">{url}</span></p>
                    <div className={`text-7xl font-black ${getScoreColor(overallScore)}`}>
                      {overallScore}
                      <span className="text-3xl text-gray-500 font-light">/100</span>
                    </div>
                    <Badge className={`mt-3 ${getScoreBg(overallScore)} text-white border-0 text-sm px-3`}>
                      {overallScore >= 80 ? "✓ Good — Keep optimizing" : overallScore >= 60 ? "⚠ Needs Improvement" : "✗ Poor — Action Required"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {results.map((r) => (
                      <div key={r.category} className="bg-white/10 rounded-xl p-3 min-w-[130px]">
                        <div className={`text-2xl font-bold ${getScoreColor(r.score)}`}>{r.score}</div>
                        <div className="text-xs text-gray-300 mt-0.5">{r.category}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export PDF Report
              </Button>
              <Button variant="outline" className="gap-2">
                <Share className="w-4 h-4" />
                Share with Client
              </Button>
            </div>

            {/* Category details */}
            {results.map((cat) => (
              <Card key={cat.category} className="border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(cat.status)}
                      <CardTitle className="text-base">{cat.category}</CardTitle>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={cat.score} className="w-24 h-2" />
                      <span className={`text-xl font-bold w-12 text-right ${getScoreColor(cat.score)}`}>{cat.score}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {cat.findings.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="mt-0.5">{getStatusIcon(f.status)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{f.item}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.detail}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
