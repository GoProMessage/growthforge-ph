"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, XCircle, Home, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "paid" | "pending" | "error">("loading");
  const [paymentMethod, setPaymentMethod] = useState("");

  const verifyPayment = useCallback(async () => {
    if (!sessionId) {
      setStatus("error");
      return;
    }
    try {
      const res = await fetch(`/api/payment/verify?session_id=${sessionId}`);
      const data = await res.json();
      if (data.isPaid) {
        setStatus("paid");
        setPaymentMethod(data.paymentMethod || "");
      } else {
        setStatus("pending");
      }
    } catch {
      setStatus("error");
    }
  }, [sessionId]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center space-y-6"
      >
        {status === "loading" && (
          <>
            <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">Verifying Payment...</h1>
            <p className="text-gray-500">Please wait while we confirm your payment.</p>
          </>
        )}

        {status === "paid" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
            </motion.div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-blue-900">Payment Successful! 🎉</h1>
              <p className="text-gray-500">
                Welcome to GrowthForge PH! Your subscription is now active.
              </p>
              {paymentMethod && (
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Paid via {paymentMethod.replace("_", " ").toUpperCase()}
                </span>
              )}
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 text-left space-y-2">
              <p className="font-bold text-blue-900 text-sm">What happens next?</p>
              {[
                "✉️ Check your email for your receipt",
                "📞 Our team will contact you within 2 hours",
                "🚀 We'll schedule your onboarding call",
                "📈 We start working on your growth strategy",
              ].map((s) => (
                <p key={s} className="text-gray-600 text-sm">{s}</p>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full border-blue-200 text-blue-700">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <a
                href="https://wa.me/639171234567?text=Hi! I just subscribed to GrowthForge PH!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </>
        )}

        {status === "pending" && (
          <>
            <div className="w-20 h-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">Payment Processing</h1>
            <p className="text-gray-500">
              Your payment is being processed. You'll receive a confirmation email shortly.
            </p>
            <Link href="/">
              <Button className="bg-blue-700 hover:bg-blue-800 text-white">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">Verification Error</h1>
            <p className="text-gray-500">
              We couldn't verify your payment. Please contact us on WhatsApp or email.
            </p>
            <Link href="/">
              <Button className="bg-blue-700 hover:bg-blue-800 text-white">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
