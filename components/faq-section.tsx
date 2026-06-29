"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "Can I really make $3,000/month with this?",
    a: "Yes. At ₱2,999/month per client on the Growth plan, you need 56 clients to reach ₱167,944/month (~$3,000 USD). Start with 5-10 local business clients, deliver value, then scale. Many of our users are digital agency owners reselling NegosyoAI services to SME clients at 5-10x markup.",
  },
  {
    q: "Do you accept GCash and PayMaya (Maya)?",
    a: "Absolutely! We fully support GCash, Maya, Visa/Mastercard credit & debit cards, and direct bank transfers (BPI, BDO, Metrobank). All payments are processed securely in Philippine Pesos (PHP).",
  },
  {
    q: "Is there a free trial?",
    a: "Yes! All plans come with a 14-day free trial — no credit card required. You get full access to every feature during your trial, including the SEO Audit Tool, AI Content Generator, Website Builder, and Client Management.",
  },
  {
    q: "Can I generate content in Tagalog and Taglish?",
    a: "Yes! Our AI Content Generator fully supports Filipino (Tagalog), English, Taglish, and Cebuano. It understands Philippine context — local slang, cultural references, and Filipino business norms — for content that resonates with local audiences.",
  },
  {
    q: "How do I get my first clients?",
    a: "Start in your immediate network — family businesses, neighborhood shops, local services. Offer a free SEO audit to demonstrate value. Many NegosyoAI users find their first 10 clients through Facebook groups, local business associations (like DTI, MSME networks), and referrals. The platform includes client management tools to help you scale.",
  },
  {
    q: "What if I want to cancel?",
    a: "Cancel anytime from your billing dashboard — no cancellation fees, no lock-in contracts. Your subscription remains active until the end of your current billing period, and you keep all your generated content and reports.",
  },
  {
    q: "Do I need technical skills?",
    a: "Zero coding or technical skills needed. NegosyoAI is built for entrepreneurs, not developers. Everything is drag-and-drop, point-and-click, and AI-guided. If you can use Facebook, you can use NegosyoAI.",
  },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="bg-gray-100 text-gray-700 border-gray-200 mb-4">FAQ</Badge>
          <h2 className="text-4xl font-bold">Common Questions</h2>
          <p className="text-muted-foreground mt-4">Everything you need to know before getting started</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="border border-border rounded-xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-muted-foreground leading-relaxed text-sm">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
