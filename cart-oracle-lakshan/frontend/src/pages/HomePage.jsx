import { useState, useEffect } from "react"
import { Clock, MapPin, Zap } from "lucide-react"
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
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <div className="w-full pb-24">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#e8f5e9] via-white to-[#f0fdf4]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 bg-[var(--green)] text-white px-3 py-1 rounded-full text-xs font-semibold">
              <Zap className="w-3 h-3" />
              <span>10 min delivery</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">{greeting},</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--dark)] mt-0.5 tracking-tight">Lakshan</h1>
          <p className="text-gray-500 mt-2 text-base">What do you need today?</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-6">
        {/* Smart suggestion nudge */}
        {context && <NudgeBanner context={context} />}

        {/* Context banner */}
        {context && <ContextBanner context={context} />}

        {/* Categories */}
        <CategoryStrip />

        {/* Products */}
        {context && context.recommended_products && (
          <ProductGrid
            title="Picked for you"
            subtitle="Based on your schedule and preferences"
            products={context.recommended_products}
          />
        )}
      </div>
    </div>
  )
}
