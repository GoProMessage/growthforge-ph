import Link from "next/link"
import { Zap } from "lucide-react"

const links = {
  Product: ["Features", "Pricing", "Website Builder", "SEO Audit", "AI Content"],
  Resources: ["Documentation", "Blog", "Case Studies", "Help Center"],
  Company: ["About Us", "Careers", "Press Kit", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
}

export function LandingFooter() {
  return (
    <footer className="bg-gray-950 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-white">Negosyo</span>
              <span className="text-amber-400">AI</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              AI-powered growth tools for Philippine businesses. Grow to ₱168K+/month (~$3,000 USD).
            </p>
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-2.5 py-1.5 text-xs">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold">G</div>
                GCash
              </div>
              <div className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-2.5 py-1.5 text-xs">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold">M</div>
                Maya
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold text-white text-sm mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2024 NegosyoAI Inc. All rights reserved. Made with ❤️ in the Philippines.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            🇵🇭 Proudly serving Filipino entrepreneurs nationwide
          </p>
        </div>
      </div>
    </footer>
  )
}
