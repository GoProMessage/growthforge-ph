"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center space-y-6"
      >
        <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
          <XCircle className="w-10 h-10 text-gray-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-blue-900">Payment Cancelled</h1>
          <p className="text-gray-500">
            No worries — your payment was cancelled and you were not charged.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-left space-y-2">
          <p className="font-bold text-amber-800 text-sm">Need help deciding?</p>
          {[
            "💬 Chat with us on WhatsApp — we reply fast!",
            "📅 Book a FREE call to learn what's right for you",
            "🔒 30-day money-back guarantee on all plans",
          ].map((s) => (
            <p key={s} className="text-gray-600 text-sm">{s}</p>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full border-blue-200 text-blue-700">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link href="/#pricing" className="flex-1">
            <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white">
              View Plans
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
