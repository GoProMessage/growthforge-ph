"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Maria Santos",
    role: "Owner, Santos Bakery — Quezon City",
    content: "NegosyoAI transformed my small bakery's online presence. The AI content generator writes social media posts in Tagalog and English automatically. My online sales grew 60% in just 3 months! Hindi ko inakala na ganito kadali.",
    avatar: "MS",
    rating: 5,
    revenue: "+60% revenue",
    avatarBg: "bg-rose-100 text-rose-700",
  },
  {
    name: "Carlo Reyes",
    role: "Founder, RealestatePH — Makati",
    content: "I was spending ₱15,000/month on a marketing agency. With NegosyoAI, I get the same quality services for ₱2,999 and do it myself in 30 minutes a week. The SEO audit alone saved me 20+ hours monthly.",
    avatar: "CR",
    rating: 5,
    revenue: "Saved ₱12K/month",
    avatarBg: "bg-blue-100 text-blue-700",
  },
  {
    name: "Janina Cruz",
    role: "CEO, JC Digital Agency — Cebu",
    content: "I run a digital agency and use NegosyoAI for all my 18 clients. The Pro plan is amazing — I resell the tools and easily make 10x my subscription cost. Best investment I've made for my agency.",
    avatar: "JC",
    rating: 5,
    revenue: "10x ROI monthly",
    avatarBg: "bg-purple-100 text-purple-700",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="bg-rose-50 text-rose-700 border-rose-100 mb-4">Success Stories</Badge>
          <h2 className="text-4xl font-bold">Filipino Entrepreneurs Love NegosyoAI</h2>
          <p className="text-xl text-muted-foreground mt-4">Real results from real Philippine businesses</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full bg-white hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.content}"</p>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${t.avatarBg}`}>
                        {t.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.role}</div>
                      </div>
                    </div>
                    <Badge className="bg-green-50 text-green-700 border-green-100 text-xs whitespace-nowrap">
                      {t.revenue}
                    </Badge>
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
