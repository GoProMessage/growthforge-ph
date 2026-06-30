"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Loader2, Copy, Download, RefreshCw, Check } from "lucide-react"

const contentTypes = [
  { value: "blog", label: "📝 Blog Post" },
  { value: "caption", label: "📱 Social Media Caption" },
  { value: "ad", label: "📢 Ad Copy" },
  { value: "email", label: "📧 Email Campaign" },
  { value: "product", label: "🛍️ Product Description" },
  { value: "seo", label: "🔍 SEO Meta Tags" },
]

const tones = ["Professional", "Friendly & Casual", "Persuasive", "Informative", "Humorous", "Urgent"]
const languages = ["English", "Filipino (Tagalog)", "Taglish", "Cebuano"]

const mockOutputs: Record<string, string> = {
  blog: `# 5 Proven Ways to Grow Your Philippine Small Business Online in 2024

Maligayang pagdating sa digital age, ka-negosyante! Growing a business online in the Philippines has never been more exciting. Here's what's working for Filipino SMEs right now:

## 1. Optimize Your Google Business Profile
With 76+ million internet users in the Philippines, Google is your frontline salesperson. Make sure your Google Business Profile is complete with updated photos, business hours, and responses to customer reviews.

**Action step:** Log in to business.google.com and complete your profile today. Takes 20 minutes.

## 2. Leverage Facebook and TikTok for Organic Reach
Filipinos average 4+ hours daily on social media — among the highest globally. Post consistently (3–5x/week) on Facebook and TikTok to reach local customers without spending on ads.

**Action step:** Create a content calendar and post Filipino-language content that resonates with your local audience.

## 3. Implement Local SEO Keywords
Target location-specific keywords like "bakery in Quezon City" or "affordable catering Cebu" to attract customers searching nearby.

**Action step:** Use NegosyoAI's SEO Audit Tool to find your top keyword opportunities.

## 4. Accept GCash and Maya Payments
67% of Filipino consumers prefer digital wallets over cash. Adding GCash and Maya to your payment options can increase conversions by 35% overnight.

**Action step:** Register for GCash for Business and Maya Business accounts — both are free.

## 5. Collect and Showcase Customer Reviews
Social proof is everything in the Philippines. Ask happy customers to review you on Google and Facebook. A 4.5-star rating builds instant trust with new visitors.

**Conclusion:** Growing your digital negosyo doesn't require a big budget — just smart, consistent execution. Start with these five strategies this week!`,

  caption: `🚀 Paano mo palalakihin ang iyong negosyo sa 2024? 

Hindi mo kailangan ng malaking pondo — kailangan mo lang ng tamang AI tools! 💪

Here's what our clients achieved this month:
✅ +43% website traffic
✅ +60% social media engagement  
✅ ₱150,000+ in NEW monthly revenue

Ang NegosyoAI ay nagbibigay sa 500+ Filipino entrepreneurs ng:
🔍 SEO Audits para malaman kung bakit hindi ka nahanap sa Google
✍️ AI Content na nakasulat sa Filipino at English
🌐 Professional website nang walang coding

Ready ka na bang palakihin ang iyong negosyo? 

💬 Comment "GROW" below at ipadala namin sa'yo ang aming FREE guide!

#NegosyoPH #SmallBusinessPH #DigitalMarketing #GrowthHacking #EntrepreneurPH #FilipinoBusiness`,

  ad: `🎯 ATTENTION Filipino Business Owners!

Gumastos ka na ba ng libo-libo sa marketing na HINDI gumagana?

STOP wasting money. START growing SMART.

✅ AI-powered content sa loob ng 30 segundo
✅ SEO audits na nagpapakita kung ANO EXACTLY ang dapat i-fix
✅ Professional website nang walang coding
✅ GCash & Maya payments — automatic

🎁 SPECIAL: FREE 14-day trial
₱0 para magsimula. Cancel anytime.

500+ Filipino businesses are growing with us na.

"Napalaki ko ang aking bakery ng 60% sa loob ng 3 buwan!" 
— Maria Santos, Santos Bakery QC

I-click ang link sa bio. 🔥

#NegosyoAI #PhilippineBusiness #DigitalMarketingPH #SME`,

  email: `Subject: Your Free SEO Audit is Ready, Maria! 📊

Hi Maria,

Kumusta ka? I just completed a quick SEO audit for Santos Bakery's website, and I found 5 opportunities that could bring you significantly more customers from Google.

**What I found:**
• Your Google ranking for "bakery Quezon City" is on page 3 — but with 2 quick fixes, you could be on page 1
• 3 images on your website are unoptimized (costing you speed)
• Your meta description is missing on 2 key pages

**The good news:** All of these are fixable in under an hour using NegosyoAI.

I'd love to walk you through the full audit results on a quick 15-minute call. Are you free this week?

Book a slot here: [calendly link]

Maraming salamat,
Juan dela Cruz
NegosyoAI

P.S. Your trial expires in 5 days. Lock in your Growth plan at ₱2,999/month before the rate increases.`,

  product: `**NegosyoAI — AI Growth Platform for Philippine Businesses**

Finally, an all-in-one digital marketing platform designed specifically for Filipino entrepreneurs.

**What's included:**
✓ SEO Audit Tool — Get a 100-point score for any website with actionable fixes
✓ AI Content Generator — Create blogs, captions, and ad copy in Filipino, English, or Taglish
✓ Website Builder — Build professional sites without coding
✓ Business Analytics — Track revenue, clients, and growth in real-time
✓ Client Management CRM — Manage all your clients in one dashboard

**Pricing:**
• Starter: ₱1,499/month
• Growth: ₱2,999/month (Most Popular)
• Pro: ₱4,999/month

**Payment:** GCash · Maya · Credit/Debit Card · Bank Transfer

Start your 14-day FREE trial today at negosyoai.com`,

  seo: `**SEO Meta Tags for Santos Bakery:**

Title Tag (57 chars):
Santos Bakery Quezon City | Fresh Breads & Pastries Daily

Meta Description (158 chars):
Trusted neighborhood bakery in Quezon City serving fresh pandesal, cakes & pastries since 2010. Order for delivery via GCash. Open 6AM–8PM daily. Visit us!

Open Graph Title:
Santos Bakery — QC's Favorite Fresh Bakery

Open Graph Description:
Fresh breads, custom cakes & pastries baked daily in Quezon City. Order online, pay via GCash. Perfect for birthdays, events & everyday snacks.

Keywords (Top 5):
1. bakery quezon city
2. fresh pandesal quezon city  
3. custom cakes qc
4. delivery bakery quezon city
5. santos bakery qc`,
}

export default function ContentPage() {
  const [contentType, setContentType] = useState("blog")
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("Professional")
  const [language, setLanguage] = useState("English")
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  const generate = useCallback(async () => {
    if (!topic.trim()) return
    setLoading(true)
    setOutput("")
    await new Promise((r) => setTimeout(r, 2000))
    setOutput(mockOutputs[contentType] || mockOutputs.blog)
    setLoading(false)
  }, [contentType, topic])

  const copyOutput = useCallback(async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  const wordCount = output.split(/\s+/).filter(Boolean).length
  const USAGE_USED = 142
  const USAGE_MAX = 200

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">AI Content Generator</h1>
        <p className="text-muted-foreground">Create high-quality Filipino & English content for your business in seconds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Settings */}
        <div className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Content Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Content type */}
              <div className="space-y-2">
                <Label>Content Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {contentTypes.map((ct) => (
                    <button
                      key={ct.value}
                      onClick={() => setContentType(ct.value)}
                      className={`text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                        contentType === ct.value
                          ? "border-blue-500 bg-blue-50 text-blue-700 font-medium shadow-sm"
                          : "border-border hover:border-blue-200 hover:bg-gray-50"
                      }`}
                    >
                      {ct.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic */}
              <div className="space-y-2">
                <Label>Topic / Subject</Label>
                <Textarea
                  placeholder="E.g., Tips for growing a sari-sari store in the Philippines, or write a caption for my new product launch..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Tone + Language */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {tones.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {languages.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={generate}
                disabled={loading || !topic.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 h-11 gap-2 shadow-md shadow-blue-100 text-base"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                {loading ? "Generating content..." : "Generate Content"}
              </Button>
            </CardContent>
          </Card>

          {/* Usage */}
          <Card className="border-border/60">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Monthly Usage</span>
                <Badge variant="secondary">{USAGE_USED} / {USAGE_MAX} pieces</Badge>
              </div>
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(USAGE_USED / USAGE_MAX) * 100}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{USAGE_MAX - USAGE_USED} pieces remaining this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Right: Output */}
        <Card className="border-border/60">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Generated Content</CardTitle>
            {output && (
              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="text-xs">{wordCount} words</Badge>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={copyOutput}>
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={generate}>
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-purple-600 animate-spin" />
                </div>
                <div className="text-center">
                  <p className="font-medium">AI is writing your content...</p>
                  <p className="text-sm text-muted-foreground mt-1">This takes about 2 seconds</p>
                </div>
              </div>
            )}

            {!loading && !output && (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Ready to generate</p>
                  <p className="text-sm text-muted-foreground mt-1">Fill in the settings on the left<br />and click Generate Content</p>
                </div>
              </div>
            )}

            <AnimatePresence>
              {output && !loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <Textarea
                    value={output}
                    onChange={(e) => setOutput(e.target.value)}
                    rows={22}
                    className="resize-none font-mono text-xs leading-relaxed"
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={copyOutput}>
                      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copied!" : "Copy All"}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Download className="w-3.5 h-3.5" />
                      Export .txt
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
