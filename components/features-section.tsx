"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Globe, BarChart3, Users, CreditCard } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "SEO Audit Tool",
    description: "Analyze any website for SEO issues instantly. Get a 100-point score with actionable fixes, priority levels, and export to PDF for clients.",
    badge: "Most Used",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: FileText,
    title: "AI Content Generator",
    description: "Create blogs, social captions, email campaigns, and ad copy in seconds — in Filipino, English, or Taglish. Perfect for every platform.",
    badge: "AI Powered",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: Globe,
    title: "Website Builder",
    description: "Build professional websites without coding. Pick from templates designed for Philippine businesses — restaurants, retail, services, and more.",
    badge: "No-Code",
    color: "text-green-600 bg-green-50",
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description: "Track MRR, client growth, content performance, and SEO rankings in one real-time dashboard. See your path to ₱168K/month.",
    badge: "Real-Time",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon: Users,
    title: "Client Management",
    description: "Manage all your clients in one CRM. Track subscriptions, send automated reports, monitor their growth, and bill them monthly.",
    badge: "Built-in CRM",
    color: "text-rose-600 bg-rose-50",
  },
  {
    icon: CreditCard,
    title: "GCash & PayMaya Payments",
    description: "Accept recurring payments from Filipino clients instantly via GCash, Maya, credit/debit cards, and bank transfers. Fully automated.",
    badge: "PH Payments",
    color: "text-teal-600 bg-teal-50",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="bg-blue-50 text-blue-700 border-blue-100 mb-4">Everything You Need</Badge>
          <h2 className="text-4xl font-bold">All-In-One Business Growth Platform</h2>
          <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Stop juggling multiple tools and subscriptions. NegosyoAI replaces 6 expensive tools with one affordable platform built for Filipino entrepreneurs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full hover:shadow-md transition-all duration-300 hover:-translate-y-1 border-border/60">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color}`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs">{feature.badge}</Badge>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
