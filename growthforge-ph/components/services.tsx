"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Globe, Star, Briefcase, Users, Zap } from "lucide-react";

const services = [
  {
    icon: TrendingUp,
    emoji: "🎯",
    title: "Lead Generation",
    badge: "Most Popular",
    badgeColor: "bg-amber-100 text-amber-700",
    description:
      "Attract high-quality prospects to your business using targeted Facebook & Google ads, SEO, and sales funnel strategies proven to work in the Philippine market.",
    features: ["Facebook & Google Ads", "SEO Optimization", "Sales Funnels", "CRM Integration"],
    color: "from-blue-500 to-blue-700",
  },
  {
    icon: Globe,
    emoji: "🌐",
    title: "Website Design & Development",
    badge: "Fast Turnaround",
    badgeColor: "bg-green-100 text-green-700",
    description:
      "Get a stunning, mobile-first website that converts visitors into customers — built fast, optimized for Google, and designed for the Filipino consumer.",
    features: ["Mobile-First Design", "SEO-Ready Structure", "Fast Load Time", "eCommerce Ready"],
    color: "from-indigo-500 to-indigo-700",
  },
  {
    icon: Star,
    emoji: "⭐",
    title: "Online Reputation Management",
    badge: "Build Trust",
    badgeColor: "bg-yellow-100 text-yellow-700",
    description:
      "Manage and grow your Google reviews, respond to feedback professionally, and build the credibility your business needs to win more customers.",
    features: ["Review Monitoring", "Response Strategy", "Negative Review Defense", "Brand Sentiment"],
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Briefcase,
    emoji: "🏆",
    title: "Brand Building",
    badge: "Stand Out",
    badgeColor: "bg-purple-100 text-purple-700",
    description:
      "We craft a compelling brand identity — logo, messaging, visuals, and social presence — that makes your business unforgettable in a crowded market.",
    features: ["Logo & Visual Identity", "Brand Guidelines", "Messaging Strategy", "Social Media Branding"],
    color: "from-purple-500 to-purple-700",
  },
  {
    icon: Users,
    emoji: "📱",
    title: "Social Media Management",
    badge: "Daily Content",
    badgeColor: "bg-blue-100 text-blue-700",
    description:
      "Full-service social media management with daily posts, community engagement, and paid campaigns tailored for Facebook, Instagram, and TikTok Philippines.",
    features: ["Daily Content Creation", "Community Management", "Paid Campaigns", "Analytics Reports"],
    color: "from-sky-500 to-cyan-600",
  },
  {
    icon: Zap,
    emoji: "💼",
    title: "Business Consulting",
    badge: "Strategic",
    badgeColor: "bg-red-100 text-red-700",
    description:
      "One-on-one digital strategy sessions to map your growth roadmap, identify quick wins, and build a long-term plan for sustainable business success.",
    features: ["Growth Audit", "Competitor Analysis", "Digital Roadmap", "Monthly Strategy Calls"],
    color: "from-rose-500 to-red-600",
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-1 text-sm">
            Our Services
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900">
            Everything Your Business Needs to{" "}
            <span className="text-amber-500">Thrive Online</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            From your first lead to a fully-recognized brand — we cover the
            complete digital growth journey for Philippine SMBs.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1 overflow-hidden">
                {/* Top gradient bar */}
                <div className={`h-1.5 bg-gradient-to-r ${service.color}`} />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl shadow-md`}
                    >
                      {service.emoji}
                    </div>
                    <Badge className={`text-xs font-semibold ${service.badgeColor} border-0`}>
                      {service.badge}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 group-hover:text-blue-700 transition-colors">
                    {service.title}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
