import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { Services } from "@/components/services"
import { RevenueCalculator } from "@/components/revenue-calculator"
import { PricingCards } from "@/components/pricing-cards"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FAQSection } from "@/components/faq-section"
import { ContactSection } from "@/components/contact-section"
import { LandingFooter } from "@/components/landing-footer"
import { WhatsAppWidget } from "@/components/whatsapp-widget"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <FeaturesSection />
      <Services />
      <RevenueCalculator />
      <PricingCards />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <LandingFooter />
      <WhatsAppWidget />
    </main>
  )
}
