"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, CreditCard, CheckCircle } from "lucide-react";

interface PaymentModalProps {
  planName: string;
  planPrice: string;
  planAmount: number; // in centavos
  ctaClass?: string;
  ctaLabel?: string;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
}

export function PaymentModal({
  planName,
  planPrice,
  ctaClass = "bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold",
  ctaLabel = "Pay Now",
}: PaymentModalProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError("Please fill in your name and email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment setup failed.");
      }

      // Redirect to PayMongo checkout (GCash / Maya / Card)
      window.location.href = data.checkoutUrl;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`w-full py-6 text-base rounded-xl ${ctaClass}`}>
          {ctaLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-900">
            Subscribe to {planName}
          </DialogTitle>
        </DialogHeader>

        {/* Plan summary */}
        <div className="bg-blue-50 rounded-xl p-4 space-y-2 mb-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">{planName} Plan</span>
            <span className="text-blue-900 font-bold text-lg">{planPrice}/mo</span>
          </div>
          <p className="text-gray-500 text-xs">Billed monthly. Cancel anytime.</p>

          {/* Payment methods */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-gray-500 text-xs">Pay with:</span>
            {[
              { label: "GCash", color: "bg-blue-100 text-blue-700" },
              { label: "Maya", color: "bg-green-100 text-green-700" },
              { label: "Card", color: "bg-gray-100 text-gray-700" },
              { label: "GrabPay", color: "bg-green-100 text-green-700" },
            ].map((m) => (
              <span
                key={m.label}
                className={`text-xs font-semibold px-2 py-0.5 rounded-md ${m.color}`}
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pm-name" className="text-gray-700 font-medium text-sm">
              Full Name *
            </Label>
            <Input
              id="pm-name"
              name="name"
              placeholder="Juan dela Cruz"
              value={form.name}
              onChange={handleChange}
              required
              className="border-gray-200"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pm-email" className="text-gray-700 font-medium text-sm">
              Email Address *
            </Label>
            <Input
              id="pm-email"
              name="email"
              type="email"
              placeholder="juan@business.com"
              value={form.email}
              onChange={handleChange}
              required
              className="border-gray-200"
            />
            <p className="text-gray-400 text-xs">Receipt will be sent here</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pm-phone" className="text-gray-700 font-medium text-sm">
              Phone / Viber (optional)
            </Label>
            <Input
              id="pm-phone"
              name="phone"
              placeholder="+63 9XX XXX XXXX"
              value={form.phone}
              onChange={handleChange}
              className="border-gray-200"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 text-base bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Redirecting to payment...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Proceed to Secure Payment
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>256-bit SSL encryption · Powered by PayMongo</span>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
