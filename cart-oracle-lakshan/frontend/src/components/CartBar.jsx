import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ShoppingCart, ChevronUp, Clock, Plus, Minus, Trash2, X } from "lucide-react"
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

  const goToCheckout = () => { setExpanded(false); navigate("/checkout") }

  return (
    <>
      {expanded && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setExpanded(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] bg-white rounded-t-3xl shadow-2xl overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--dark)]">Your cart</h2>
              <button onClick={() => setExpanded(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="overflow-y-auto max-h-[50vh] divide-y divide-gray-50">
              {items.map((item, i) => (
                <div key={i} className="px-6 py-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold text-gray-300">
                    {item.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--dark)] truncate">{item.name}</p>
                    <p className="text-sm font-bold text-[var(--dark)]">₹{item.price * item.qty}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQty(item.name, -1)} className="px-2.5 py-1.5 hover:bg-gray-50"><Minus className="w-3 h-3" /></button>
                      <span className="px-2 py-1.5 text-xs font-bold border-x border-gray-200 min-w-[24px] text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.name, 1)} className="px-2.5 py-1.5 hover:bg-gray-50"><Plus className="w-3 h-3" /></button>
                    </div>
                    <button onClick={() => removeItem(item.name)} className="p-1.5 text-gray-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 px-6 py-4">
              <button onClick={goToCheckout} className="w-full py-3.5 bg-[var(--green)] hover:bg-[#0a6e1a] text-white font-bold rounded-xl transition-colors text-sm">
                Checkout — ₹{total}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-3">
          <div className="bg-[var(--green)] text-white rounded-2xl shadow-lg px-5 py-3 flex items-center justify-between">
            <button onClick={() => setExpanded(true)} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{count} item{count > 1 ? 's' : ''}</span>
                <span className="text-white/60">•</span>
                <span className="text-sm font-bold">₹{total}</span>
              </div>
              <ChevronUp className="w-4 h-4 text-white/70 ml-1" />
            </button>
            <button onClick={goToCheckout} className="bg-white text-[var(--green)] px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
              View Cart →
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
