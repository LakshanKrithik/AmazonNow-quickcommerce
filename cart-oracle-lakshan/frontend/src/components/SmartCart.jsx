import { useState } from "react"
import axios from "axios"
import { API_BASE } from "../config"

export default function SmartCart({ data }) {
  const { cart_prediction, recommended_products } = data
  const [checkedOut, setCheckedOut] = useState(false)
  const [reviews, setReviews] = useState({})

  const fetchReviews = async (productName) => {
    const res = await axios.get(`${API_BASE}/reviews/${encodeURIComponent(productName)}`)
    setReviews(prev => ({ ...prev, [productName]: res.data.synthesis }))
  }

  if (checkedOut) return (
    <div className="bg-green-900/30 border border-green-500/30 rounded-2xl p-8 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h2 className="text-2xl font-bold text-green-400">Order Placed!</h2>
      <p className="text-gray-400 mt-2">Cart Oracle handled everything. You didn't search once.</p>
    </div>
  )

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-1">🛒 Your Pre-Built Cart</h2>
      <p className="text-gray-400 text-sm mb-6">Ready before you opened the app</p>

      <div className="space-y-4 mb-6">
        {recommended_products.map((product, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-white font-medium">{product.name}</p>
                <p className="text-gray-400 text-sm">⚡ {product.delivery} • ⭐ {product.rating}</p>
              </div>
              <p className="text-orange-400 font-bold">₹{product.price}</p>
            </div>
            
            <p className="text-gray-500 text-xs mb-2">
              {cart_prediction.cart_items[i]?.reason}
            </p>

            <button
              onClick={() => fetchReviews(product.name)}
              className="text-xs text-orange-400 hover:underline"
            >
              AI Review Summary →
            </button>

            {reviews[product.name] && (
              <div className="mt-3 bg-gray-700 rounded-lg p-3">
                <div className="flex gap-4 mb-2">
                  <div>
                    {reviews[product.name].pros.map((p, i) => (
                      <p key={i} className="text-green-400 text-xs">✅ {p}</p>
                    ))}
                  </div>
                  <div>
                    {reviews[product.name].cons.map((c, i) => (
                      <p key={i} className="text-red-400 text-xs">❌ {c}</p>
                    ))}
                  </div>
                </div>
                <p className="text-orange-400 text-xs font-bold">
                  Verdict: {reviews[product.name].verdict}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => setCheckedOut(true)}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-lg transition-all active:scale-95"
      >
        Confirm Cart — One Tap ⚡
      </button>
    </div>
  )
}
