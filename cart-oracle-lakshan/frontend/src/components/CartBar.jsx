// components/CartBar.jsx - Sticky checkout bar at bottom
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ShoppingCart, ChevronUp, Clock, Plus, Minus, Trash2, X, ShieldCheck } from "lucide-react"
import { useCartStore } from "../stores/useCartStore"

export default function CartBar() {
  const items = useCartStore(s => s.items)
  const updateQty = useCartStore(s => s.updateQty)
  const removeItem = useCartStore(s => s.removeItem)
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

  const total = items.reduce((sum, i) => sum + (i.price * i.qty), 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  if (items.length === 0) return null

  const goToCheckout = () => {
    setExpanded(false)
    navigate("/checkout")
  }

  return (
    <>
      {/* Expanded cart drawer */}
      {expanded && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setExpanded(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] bg-white rounded-t-3xl shadow-2xl overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#131921]">Your Cart ({count} items)</h2>
              <button onClick={() => setExpanded(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[50vh] divide-y divide-gray-100">
              {items.map((item, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100">
                    <span className="text-xl opacity-30">📦</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#131921] truncate">{item.name}</h3>
                    <p className="text-sm font-bold text-[#131921]">₹{item.price} × {item.qty}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button onClick={() => updateQty(item.name, -1)} className="px-2.5 py-1.5 hover:bg-gray-50">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 py-1.5 text-sm font-bold border-x border-gray-300 min-w-[28px] text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.name, 1)} className="px-2.5 py-1.5 hover:bg-gray-50">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.name)} className="p-1.5 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 px-6 py-4">
              <button
                onClick={goToCheckout}
                className="w-full py-4 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-xl text-base font-bold text-[#0F1111] transition-colors"
              >
                Checkout • ₹{total}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={() => setExpanded(true)} className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-[#131921]" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FF9900] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {count}
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-[#131921]">₹{total}</p>
              <p className="text-xs text-gray-500">{count} items • View cart</p>
            </div>
            <ChevronUp className="w-4 h-4 text-gray-400 ml-2" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[#067D62]">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">10 min</span>
            </div>
            <button
              onClick={goToCheckout}
              className="px-8 py-3 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-xl text-sm font-bold text-[#0F1111] transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
