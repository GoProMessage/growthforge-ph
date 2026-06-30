"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, Plus, ExternalLink, Edit, CheckCircle, Eye } from "lucide-react"

const websites = [
  {
    id: "1",
    name: "Santos Bakery",
    url: "santos-bakery.negosyoai.com",
    template: "Restaurant & Food",
    status: "live",
    visitors: 1240,
    lastEdited: "2 days ago",
    emoji: "🍞",
  },
  {
    id: "2",
    name: "Juan's Portfolio",
    url: "juan-delacruz.negosyoai.com",
    template: "Portfolio",
    status: "draft",
    visitors: 0,
    lastEdited: "1 week ago",
    emoji: "🎨",
  },
]

const templates = [
  { id: "restaurant", name: "Restaurant / Food", emoji: "🍜", desc: "Perfect for food businesses & carinderias", color: "border-orange-200 hover:border-orange-400" },
  { id: "retail", name: "Retail Store", emoji: "🛍️", desc: "For shops, boutiques & online stores", color: "border-pink-200 hover:border-pink-400" },
  { id: "services", name: "Services Business", emoji: "⚙️", desc: "Plumbing, cleaning, repair services", color: "border-blue-200 hover:border-blue-400" },
  { id: "portfolio", name: "Portfolio / Freelancer", emoji: "🎨", desc: "Showcase your work and skills", color: "border-purple-200 hover:border-purple-400" },
  { id: "real-estate", name: "Real Estate", emoji: "🏠", desc: "Property listings and agent profiles", color: "border-green-200 hover:border-green-400" },
  { id: "medical", name: "Medical / Clinic", emoji: "🏥", desc: "Healthcare providers & clinics", color: "border-teal-200 hover:border-teal-400" },
  { id: "events", name: "Events & Catering", emoji: "🎉", desc: "Event venues, caterers, photographers", color: "border-amber-200 hover:border-amber-400" },
  { id: "education", name: "Education / Tutorial", emoji: "📚", desc: "Tutorial centers, online courses", color: "border-cyan-200 hover:border-cyan-400" },
  { id: "beauty", name: "Beauty & Wellness", emoji: "💅", desc: "Salons, spas & beauty services", color: "border-rose-200 hover:border-rose-400" },
]

export default function WebsitePage() {
  const [view, setView] = useState<"list" | "new">("list")

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Website Builder</h1>
          <p className="text-muted-foreground">Build professional websites for your business — no coding required</p>
        </div>
        <div className="flex gap-2">
          {view === "new" && (
            <Button variant="outline" onClick={() => setView("list")}>← Back to Sites</Button>
          )}
          {view === "list" && (
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={() => setView("new")}>
              <Plus className="w-4 h-4" />
              New Website
            </Button>
          )}
        </div>
      </div>

      {/* Usage */}
      <Card className="bg-blue-50 border-blue-100">
        <CardContent className="p-4 flex items-center justify-between">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">2 of 3 websites</span> used on your Growth plan
          </p>
          <Badge className="bg-blue-600 text-white border-0">1 slot remaining</Badge>
        </CardContent>
      </Card>

      {/* Site list */}
      {view === "list" && (
        <div className="space-y-4">
          {websites.map((site) => (
            <Card key={site.id} className="hover:shadow-sm transition-shadow border-border/60">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {site.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">{site.name}</p>
                      <Badge className={site.status === "live" ? "bg-green-100 text-green-700 border-0 gap-1" : "bg-gray-100 text-gray-600 border-0"}>
                        {site.status === "live" && <CheckCircle className="w-3 h-3" />}
                        {site.status === "live" ? "Live" : "Draft"}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">{site.template}</Badge>
                    </div>
                    <p className="text-sm text-blue-600 hover:underline cursor-pointer mt-0.5">{site.url}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {site.visitors > 0 ? `${site.visitors.toLocaleString()} visitors this month` : "No visitors yet"} · Last edited {site.lastEdited}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Visit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add new card */}
          <Card
            className="border-dashed border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer"
            onClick={() => setView("new")}
          >
            <CardContent className="p-8 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Plus className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-700">Create New Website</p>
                <p className="text-sm text-muted-foreground">Pick a template and launch in minutes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Template picker */}
      {view === "new" && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Choose a Template</h2>
          <p className="text-muted-foreground text-sm">All templates are mobile-responsive and optimized for Philippine businesses</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {templates.map((t) => (
              <Card
                key={t.id}
                className={`cursor-pointer hover:shadow-md transition-all border-2 ${t.color}`}
              >
                <CardContent className="p-5 text-center space-y-3">
                  <div className="text-4xl">{t.emoji}</div>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full">
                    Use This Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
