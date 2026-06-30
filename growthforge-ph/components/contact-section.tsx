"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Phone, Mail, MapPin, Loader2, AlertCircle } from "lucide-react";

interface FormData {
  name: string;
  business: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export function ContactSection() {
  const [form, setForm] = useState<FormData>({
    name: "",
    business: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-1 text-sm">
                Get In Touch
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900">
                Ready to{" "}
                <span className="text-amber-500">Grow Your Business?</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                Book a FREE consultation today. No obligation, no pressure — just
                a friendly conversation about how we can help your business reach
                more customers online.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Phone,
                  label: "Call / Viber / WhatsApp",
                  value: "+63 917 123 4567",
                },
                { icon: Mail, label: "Email Us", value: "hello@growthforgeph.com" },
                {
                  icon: MapPin,
                  label: "Serving All of the Philippines",
                  value: "Metro Manila · Cebu · Davao · Nationwide",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className="text-blue-900 font-semibold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-3">
              <p className="font-bold text-blue-900">🎁 What you get — FREE:</p>
              {[
                "Full digital audit of your business",
                "Competitor analysis report",
                "Custom growth recommendations",
                "No sales pressure, ever",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-4"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900">
                    Message Received! 🎉
                  </h3>
                  <p className="text-gray-500">
                    Thank you! Our team will reach out within 24 hours to schedule
                    your free consultation.
                  </p>
                  <p className="text-amber-600 font-semibold text-sm">
                    Check your email for a confirmation.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", business: "", email: "", phone: "", service: "", message: "" });
                    }}
                    className="mt-4 border-blue-200 text-blue-700"
                  >
                    Submit Another Inquiry
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-1">
                      Book Your Free Consultation
                    </h3>
                    <p className="text-gray-400 text-sm">
                      We'll respond within 24 hours, Monday–Saturday.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-gray-700 font-medium text-sm">
                        Your Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Juan dela Cruz"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="business" className="text-gray-700 font-medium text-sm">
                        Business Name *
                      </Label>
                      <Input
                        id="business"
                        name="business"
                        placeholder="My Awesome Business"
                        value={form.business}
                        onChange={handleChange}
                        required
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="juan@business.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-gray-700 font-medium text-sm">
                        Phone / Viber
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+63 9XX XXX XXXX"
                        value={form.phone}
                        onChange={handleChange}
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-gray-700 font-medium text-sm">
                      Service You're Interested In
                    </Label>
                    <Select
                      onValueChange={(v) =>
                        setForm((prev) => ({ ...prev, service: v }))
                      }
                    >
                      <SelectTrigger className="border-gray-200">
                        <SelectValue placeholder="Select a service..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead-gen">Lead Generation</SelectItem>
                        <SelectItem value="website">Website Design</SelectItem>
                        <SelectItem value="reputation">Reputation Management</SelectItem>
                        <SelectItem value="branding">Brand Building</SelectItem>
                        <SelectItem value="social">Social Media Management</SelectItem>
                        <SelectItem value="consulting">Business Consulting</SelectItem>
                        <SelectItem value="full">Full Growth Package</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-gray-700 font-medium text-sm">
                      Tell Us About Your Business
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="What does your business do? What challenges are you facing? What are your growth goals?"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      className="border-gray-200 focus:border-blue-500 resize-none"
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
                    className="w-full py-6 text-base bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Book My Free Consultation →"
                    )}
                  </Button>

                  <p className="text-center text-gray-400 text-xs">
                    🔒 Your information is private and secure. We'll never spam you.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
