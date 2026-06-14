import { ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function NudgeBanner({ context }) {
  const navigate = useNavigate()
  const cart = context.cart_prediction

  if (!cart) return null

  return (
    <button
      onClick={() => navigate("/cart")}
      className="w-full bg-white border border-gray-200 rounded-2xl p-5 mb-6 flex items-center gap-4 hover:border-[#FF9900] hover:shadow-md transition-all text-left group"
    >
      <div className="w-12 h-12 bg-[#FFF3E0] rounded-xl flex items-center justify-center shrink-0">
        <span className="text-2xl">🛒</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-[#131921]">{cart.nudge_message}</p>
        <p className="text-sm text-gray-500 mt-0.5">{cart.cart_items?.length || 0} items curated for you • Tap to review</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#FF9900] transition-colors shrink-0" />
    </button>
  )
}
