"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Maria Santos",
    role: "Restaurant Owner",
    location: "Cebu City",
    avatar: "MS",
    rating: 5,
    text: "GrowthForge completely transformed our online presence. Within 6 weeks, our Facebook inquiries tripled and we had to hire 2 more staff to handle bookings. Best investment we ever made!",
    highlight: "3× more inquiries in 6 weeks",
  },
  {
    name: "Juan dela Cruz",
    role: "Hardware Store Owner",
    location: "Quezon City, Metro Manila",
    avatar: "JD",
    rating: 5,
    text: "Hindi ako marunong sa digital marketing pero ang team ng GrowthForge ay very patient at professional. Ngayon, top 1 kami sa Google search para sa aming area. Sobrang worth it!",
    highlight: "#1 on Google in their area",
  },
  {
    name: "Kristine Reyes",
    role: "Salon & Spa Owner",
    location: "Davao City",
    avatar: "KR",
    rating: 5,
    text: "Our website looks amazing and actually brings in new customers every week. The team handles all our social media too, so I can focus on running the salon. Highly recommend!",
    highlight: "New clients weekly from website",
  },
  {
    name: "Rolando Mendoza",
    role: "Real Estate Agent",
    location: "Makati, Metro Manila",
    avatar: "RM",
    rating: 5,
    text: "The lead generation campaign they built for my real estate business brings in 20-30 qualified leads every month on autopilot. My sales pipeline has never been this full.",
    highlight: "20–30 qualified leads per month",
  },
  {
    name: "Anna Lim",
    role: "Online Clothing Boutique",
    location: "Iloilo City",
    avatar: "AL",
    rating: 5,
    text: "From zero online presence to 15K Instagram followers and a fully functional online store in 3 months. The GrowthForge team delivered beyond my expectations!",
    highlight: "15K followers + full online store in 3 months",
  },
  {
    name: "Ben Torres",
    role: "Construction Business Owner",
    location: "Baguio City",
    avatar: "BT",
    rating: 5,
    text: "I was skeptical at first, but after the free audit I could see exactly what was missing. Six months in and our revenue is up 40%. Worth every peso.",
    highlight: "+40% revenue in 6 months",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 px-4 py-1 text-sm">
            Client Reviews
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900">
            Real Results from Real{" "}
            <span className="text-amber-500">Philippine Businesses</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Don't just take our word for it — hear from business owners across
            the Philippines who've grown with GrowthForge.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-white">
                <CardContent className="p-6 flex flex-col h-full gap-4">
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Highlight pill */}
                  <div className="inline-flex">
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
                      ✨ {t.highlight}
                    </span>
                  </div>

                  {/* Review text */}
                  <p className="text-gray-600 text-sm leading-relaxed flex-1 italic">
                    "{t.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900 text-sm">{t.name}</p>
                      <p className="text-gray-400 text-xs">
                        {t.role} · {t.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
