"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Zap, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Free Business Audit",
    description:
      "We start with a thorough analysis of your current digital presence, competitors, and growth opportunities — completely free, no strings attached.",
    color: "bg-blue-600",
  },
  {
    icon: FileText,
    step: "02",
    title: "Custom Growth Strategy",
    description:
      "Our team creates a tailored digital growth plan based on your business goals, budget, and target market in the Philippines.",
    color: "bg-indigo-600",
  },
  {
    icon: Zap,
    step: "03",
    title: "Execute & Launch",
    description:
      "We implement your strategy fast — campaigns go live, your website goes up, and your brand starts showing up where your customers are looking.",
    color: "bg-amber-500",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Grow & Optimize",
    description:
      "We monitor results daily, optimize campaigns weekly, and report to you monthly — continuously improving your ROI and online presence.",
    color: "bg-green-600",
  },
];

export function Process() {
  return (
    <section id="process" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-1 text-sm">
            How It Works
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900">
            Your Path to{" "}
            <span className="text-amber-500">Digital Success</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            A simple, proven 4-step process to grow your business online — from
            audit to results in as little as 30 days.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-600 via-amber-400 to-green-500 z-0" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center space-y-4"
              >
                {/* Icon circle */}
                <div className="flex justify-center">
                  <div
                    className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-amber-500 tracking-widest uppercase">
                    Step {step.step}
                  </p>
                  <h3 className="text-xl font-bold text-blue-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-8 py-4 rounded-xl shadow-lg shadow-amber-200 transition-all hover:-translate-y-0.5 text-base"
          >
            Start Your Free Audit Today →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
