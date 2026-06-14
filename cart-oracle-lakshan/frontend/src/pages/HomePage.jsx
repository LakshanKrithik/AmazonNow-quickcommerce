import { useState, useEffect } from "react"
import { Clock, MapPin, ChevronRight } from "lucide-react"
import CategoryStrip from "../components/home/CategoryStrip"
import ProductGrid from "../components/home/ProductGrid"
import ContextBanner from "../components/home/ContextBanner"
import NudgeBanner from "../components/home/NudgeBanner"

const API_BASE = "http://localhost:8000"

export default function HomePage() {
  const [context, setContext] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContext()
  }, [])

  const fetchContext = async () => {
    try {
      const res = await fetch(`${API_BASE}/context`)
      const json = await res.json()
      setContext(json)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <div className="w-full">
      {/* Delivery info bar */}
      <div className="bg-[#067D62] text-white px-6 py-2.5">
        <div className="max-w-[1400px] mx-auto flex items-center gap-3">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Delivery in 10 minutes</span>
          <span className="text-white/60">•</span>
          <span className="text-sm text-white/80">Free delivery on orders above ₹199</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Hero */}
        <div className="bg-white rounded-2xl p-8 mb-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <MapPin className="w-4 h-4" />
            <span>Delivering to Chennai, 600001</span>
          </div>
          <p className="text-gray-500 text-base">{greeting},</p>
          <h1 className="text-3xl font-bold text-[#131921]">Lakshan</h1>
          <p className="text-gray-500 mt-1">What do you need today? We've got suggestions ready for you.</p>
        </div>

        {/* Context-aware nudge */}
        {context && <NudgeBanner context={context} />}

        {/* Context banner */}
        {context && <ContextBanner context={context} />}

        {/* Categories */}
        <CategoryStrip />

        {/* Product Grid */}
        {context && context.recommended_products && (
          <ProductGrid
            title="Recommended for you"
            subtitle="Based on your upcoming plans"
            products={context.recommended_products}
          />
        )}
      </div>
    </div>
  )
}
