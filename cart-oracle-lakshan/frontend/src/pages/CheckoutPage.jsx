import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCartStore } from "../stores/useCartStore"
import { MapPin, Clock, CreditCard, ShieldCheck, ChevronRight, Truck } from "lucide-react"

export default function CheckoutPage() {
  const items = useCartStore(s => s.items)
  const clearCart = useCartStore(s => s.clearCart)
  const navigate = useNavigate()
  const [ordered, setOrdered] = useState(false)

  const subtotal = items.reduce((sum, i) => sum + (i.price * i.qty), 0)
  const delivery = subtotal >= 199 ? 0 : 25
  const total = subtotal + delivery
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0)

  if (items.length === 0 && !ordered) {
    navigate("/")
    return null
  }

  if (ordered) {
    return (
      <div className="max-w-[700px] mx-auto px-6 py-16 text-center">
        <div className="w-20 h-20 bg-[#067D62] rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#131921] mb-2">Order confirmed!</h1>
        <p className="text-gray-500 text-lg mb-2">Order #AMZ-{Math.floor(Math.random() * 90000 + 10000)}</p>
        <div className="flex items-center justify-center gap-2 text-[#067D62] font-semibold mb-8">
          <Truck className="w-5 h-5" />
          <span>Estimated delivery in 10 minutes</span>
        </div>
        <button
          onClick={() => { clearCart(); navigate("/"); }}
          className="px-8 py-3 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-xl text-sm font-bold text-[#0F1111]"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold text-[#131921] mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Delivery Address */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[#131921]">Delivery address</h2>
              <button className="text-sm text-[#007185] font-medium hover:underline">Change</button>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#131921]">Lakshan</p>
                <p className="text-sm text-gray-600">123, Anna Nagar, Chennai - 600001</p>
                <p className="text-sm text-gray-600">Tamil Nadu, India</p>
                <p className="text-sm text-gray-500 mt-1">Phone: +91 98xxx xxxxx</p>
              </div>
            </div>
          </div>

          {/* Delivery Time */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="text-base font-bold text-[#131921] mb-3">Delivery slot</h2>
            <div className="flex items-center gap-3 p-3 bg-[#E8F5E9] border border-[#A5D6A7] rounded-xl">
              <Clock className="w-5 h-5 text-[#067D62]" />
              <div>
                <p className="text-sm font-semibold text-[#131921]">Express Delivery — 10 minutes</p>
                <p className="text-xs text-gray-600">Fastest delivery to your location</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="text-base font-bold text-[#131921] mb-3">Items ({itemCount})</h2>
            <div className="divide-y divide-gray-100">
              {items.map((item, i) => (
                <div key={i} className="py-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 border border-gray-100">
                    <span className="text-lg opacity-30">📦</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#131921] truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                  </div>
                  <span className="text-sm font-bold text-[#131921]">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="text-base font-bold text-[#131921] mb-3">Payment method</h2>
            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-semibold text-[#131921]">Pay on Delivery</p>
                <p className="text-xs text-gray-500">Cash, UPI, or card on delivery</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
            </div>
          </div>
        </div>

        {/* Right - Order Summary */}
        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-[110px]">
            <h2 className="text-base font-bold text-[#131921] mb-4">Order summary</h2>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Items ({itemCount})</span>
                <span className="text-[#131921]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className={delivery === 0 ? "text-[#067D62] font-medium" : "text-[#131921]"}>
                  {delivery === 0 ? "FREE" : `₹${delivery}`}
                </span>
              </div>
              {delivery === 0 && (
                <p className="text-xs text-[#067D62]">Free delivery on orders above ₹199</p>
              )}
            </div>

            <div className="border-t border-gray-200 pt-3 mb-5">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-[#131921]">Total</span>
                <span className="text-lg font-bold text-[#131921]">₹{total}</span>
              </div>
            </div>

            <button
              onClick={() => setOrdered(true)}
              className="w-full py-4 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-xl text-base font-bold text-[#0F1111] transition-colors"
            >
              Place Order
            </button>

            <p className="text-[11px] text-gray-500 text-center mt-3 leading-relaxed">
              By placing your order, you agree to Amazon Now's conditions of use and privacy notice.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
