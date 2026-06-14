import { ChevronRight, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function NudgeBanner({ context }) {
  const navigate = useNavigate()
  const cart = context.cart_prediction
  if (!cart) return null

  return (
    <button
      onClick={() => navigate("/cart")}
      className="w-full bg-white rounded-2xl p-4 mb-4 flex items-center gap-4 border border-gray-100 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all text-left group"
    >
      <div className="w-11 h-11 bg-[var(--green-light)] rounded-xl flex items-center justify-center shrink-0">
        <Zap className="w-5 h-5 text-[var(--green)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--dark)]">{cart.nudge_message}</p>
        <p className="text-xs text-gray-500 mt-0.5">{cart.cart_items?.length || 0} items ready • View smart cart</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[var(--green)] group-hover:translate-x-0.5 transition-all shrink-0" />
    </button>
  )
}
