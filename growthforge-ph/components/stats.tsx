"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "200+", label: "SMBs Helped", emoji: "🏢" },
  { value: "₱50M+", label: "Revenue Generated for Clients", emoji: "💰" },
  { value: "3.5×", label: "Average Lead Increase", emoji: "📈" },
  { value: "94%", label: "Client Retention Rate", emoji: "🤝" },
];

export function Stats() {
  return (
    <section className="py-16 gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-2"
            >
              <div className="text-3xl">{stat.emoji}</div>
              <div className="text-4xl font-extrabold text-amber-400">{stat.value}</div>
              <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
