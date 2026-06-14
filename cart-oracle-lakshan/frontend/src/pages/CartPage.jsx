import { useState, useEffect } from "react"
import { Clock, Star, ShieldCheck, Loader2, Plus, Minus, Trash2, CloudRain, Sun, Cloud, X } from "lucide-react"

const API_BASE = "http://localhost:8000"

const BROWSE_CATALOG = [
  { name: "Amul Taaza Milk 1L", price: 72, delivery: "8 mins", rating: 4.5, category: "Dairy" },
  { name: "Britannia Bread", price: 45, delivery: "8 mins", rating: 4.3, category: "Dairy" },
  { name: "Eggs (6 pack)", price: 55, delivery: "10 mins", rating: 4.4, category: "Dairy" },
  { name: "Amul Butter 100g", price: 56, delivery: "8 mins", rating: 4.6, category: "Dairy" },
  { name: "Paneer 200g", price: 80, delivery: "10 mins", rating: 4.4, category: "Dairy" },
  { name: "Curd 400g", price: 40, delivery: "8 mins", rating: 4.4, category: "Dairy" },
  { name: "Lays Magic Masala", price: 20, delivery: "8 mins", rating: 4.5, category: "Snacks" },
  { name: "Kurkure Masala Munch", price: 20, delivery: "8 mins", rating: 4.3, category: "Snacks" },
  { name: "Haldirams Bhujia 200g", price: 65, delivery: "10 mins", rating: 4.6, category: "Snacks" },
  { name: "Dark Fantasy Choco Fills", price: 40, delivery: "8 mins", rating: 4.7, category: "Snacks" },
  { name: "Oreo Biscuits", price: 30, delivery: "8 mins", rating: 4.5, category: "Snacks" },
  { name: "Hide & Seek Biscuit", price: 35, delivery: "8 mins", rating: 4.5, category: "Snacks" },
  { name: "Parle-G Family Pack", price: 45, delivery: "8 mins", rating: 4.6, category: "Snacks" },
  { name: "Coca-Cola 750ml", price: 40, delivery: "8 mins", rating: 4.4, category: "Drinks" },
  { name: "Sprite 750ml", price: 40, delivery: "8 mins", rating: 4.3, category: "Drinks" },
  { name: "Thums Up 2L", price: 90, delivery: "10 mins", rating: 4.5, category: "Drinks" },
  { name: "Real Mango Juice 1L", price: 99, delivery: "10 mins", rating: 4.4, category: "Drinks" },
  { name: "Bisleri Water 5L", price: 55, delivery: "8 mins", rating: 4.2, category: "Drinks" },
  { name: "Red Bull 250ml", price: 125, delivery: "8 mins", rating: 4.3, category: "Drinks" },
  { name: "Cold Coffee 200ml", price: 35, delivery: "8 mins", rating: 4.3, category: "Drinks" },
  { name: "Paper Cups 50pc", price: 89, delivery: "10 mins", rating: 4.1, category: "Party" },
  { name: "Paper Plates 25pc", price: 69, delivery: "10 mins", rating: 4.2, category: "Party" },
  { name: "Maggi 12 Pack", price: 120, delivery: "8 mins", rating: 4.6, category: "Instant" },
  { name: "Cup Noodles Masala", price: 45, delivery: "8 mins", rating: 4.3, category: "Instant" },
  { name: "Knorr Soup Tomato", price: 45, delivery: "10 mins", rating: 4.2, category: "Instant" },
  { name: "Maggi Hot Heads", price: 35, delivery: "8 mins", rating: 4.2, category: "Instant" },
  { name: "Dettol Handwash 200ml", price: 65, delivery: "10 mins", rating: 4.4, category: "Essentials" },
  { name: "Tata Salt 1kg", price: 28, delivery: "8 mins", rating: 4.7, category: "Essentials" },
  { name: "Fortune Oil 1L", price: 145, delivery: "12 mins", rating: 4.4, category: "Essentials" },
  { name: "Umbrella Auto-open", price: 299, delivery: "15 mins", rating: 4.3, category: "Rain" },
  { name: "Raincoat Adults", price: 499, delivery: "15 mins", rating: 4.1, category: "Rain" },
  { name: "Dolo-650 Strip", price: 30, delivery: "10 mins", rating: 4.8, category: "Pharmacy" },
  { name: "Band-Aid 10pcs", price: 45, delivery: "10 mins", rating: 4.4, category: "Pharmacy" },
  { name: "Crocin Advance", price: 25, delivery: "10 mins", rating: 4.6, category: "Pharmacy" },
  { name: "Ice Cream Tub 500ml", price: 199, delivery: "10 mins", rating: 4.6, category: "Dessert" },
  { name: "Chocolate Bar Pack", price: 60, delivery: "8 mins", rating: 4.5, category: "Dessert" },
]

export default function CartPage() {
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState([])
  const [ordered, setOrdered] = useState(false)
  const [showBrowse, setShowBrowse] = useState(false)
  const [browseFilter, setBrowseFilter] = useState("All")
  const [contextMsg, setContextMsg] = useState("")
  const [weatherInfo, setWeatherInfo] = useState(null)
  const [activeMode, setActiveMode] = useState("smart")

  useEffect(() => {
    // Check for voice cart items first
    const voiceItems = sessionStorage.getItem("voiceCartItems")
    if (voiceItems) {
      try {
        const items = JSON.parse(voiceItems)
        setCartItems(items.map(p => ({
          name: p.name,
          price: p.price,
          delivery: p.delivery || "10 mins",
          rating: p.rating || 4.3,
          reason: p.reason,
          qty: p.quantity || 1
        })))
        setContextMsg(`Voice cart: ${items.length} items added from your request`)
        setActiveMode("voice")
        sessionStorage.removeItem("voiceCartItems")
        setLoading(false)
      } catch {
        loadSmartCart()
      }
    } else {
      loadSmartCart()
    }
  }, [])

  const loadSmartCart = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/context`)
      const json = await res.json()
      if (json.recommended_products) {
        setCartItems(json.recommended_products.map(p => ({ ...p, qty: 1 })))
      }
      setContextMsg(json.cart_prediction?.reasoning || "")
      setWeatherInfo(json.context?.weather)
      setActiveMode("smart")
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadWeatherCart = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/cart/weather`)
      const json = await res.json()
      if (json.items) {
        setCartItems(json.items.map(p => ({ ...p, qty: 1 })))
      }
      setContextMsg(json.reasoning || "")
      setWeatherInfo(json.weather)
      setActiveMode("weather")
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadTimeCart = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/cart/time`)
      const json = await res.json()
      if (json.items) {
        setCartItems(json.items.map(p => ({ ...p, qty: 1 })))
      }
      setContextMsg(json.reasoning || "")
      setActiveMode("time")
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateQty = (index, delta) => {
    setCartItems(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], qty: Math.max(1, updated[index].qty + delta) }
      return updated
    })
  }

  const removeItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index))
  }

  const addFromBrowse = (product) => {
    const exists = cartItems.findIndex(i => i.name === product.name)
    if (exists >= 0) {
      updateQty(exists, 1)
    } else {
      setCartItems(prev => [...prev, { ...product, qty: 1 }])
    }
  }

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0)
  const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0)

  const filteredCatalog = browseFilter === "All"
    ? BROWSE_CATALOG
    : BROWSE_CATALOG.filter(p => p.category === browseFilter)

  const categories = ["All", ...new Set(BROWSE_CATALOG.map(p => p.category))]

  if (ordered) return (
    <div className="max-w-[800px] mx-auto px-6 py-20 text-center">
      <div className="w-20 h-20 bg-[#067D62] rounded-full flex items-center justify-center mx-auto mb-5">
        <ShieldCheck className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-[#131921] mb-2">Order placed successfully!</h2>
      <p className="text-gray-500 text-lg">Arriving in 10 minutes • Order #AMZ-{Math.floor(Math.random() * 90000 + 10000)}</p>
    </div>
  )

  return (
    <div className="w-full">
      <div className="max-w-[1000px] mx-auto px-6 py-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-[#131921] mb-5">Smart Cart</h1>

        {/* Mode Selector - big, visible, retail buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={loadSmartCart}
            className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
              activeMode === "smart"
                ? "border-[#FF9900] bg-[#FFF8F0] shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              activeMode === "smart" ? "bg-[#FF9900]" : "bg-gray-100"
            }`}>
              <span className="text-xl">🛒</span>
            </div>
            <span className={`text-sm font-semibold ${activeMode === "smart" ? "text-[#131921]" : "text-gray-600"}`}>
              Smart Picks
            </span>
            <span className="text-xs text-gray-500">AI suggestions</span>
          </button>

          <button
            onClick={loadWeatherCart}
            className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
              activeMode === "weather"
                ? "border-[#1565C0] bg-[#E3F2FD] shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              activeMode === "weather" ? "bg-[#1565C0]" : "bg-gray-100"
            }`}>
              {activeMode === "weather"
                ? <CloudRain className="w-6 h-6 text-white" />
                : <CloudRain className="w-6 h-6 text-gray-500" />
              }
            </div>
            <span className={`text-sm font-semibold ${activeMode === "weather" ? "text-[#131921]" : "text-gray-600"}`}>
              Weather Cart
            </span>
            <span className="text-xs text-gray-500">
              {weatherInfo ? `${weatherInfo.temp}°C ${weatherInfo.condition}` : "Based on weather"}
            </span>
          </button>

          <button
            onClick={loadTimeCart}
            className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
              activeMode === "time"
                ? "border-[#067D62] bg-[#E8F5E9] shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              activeMode === "time" ? "bg-[#067D62]" : "bg-gray-100"
            }`}>
              <span className="text-xl">🕐</span>
            </div>
            <span className={`text-sm font-semibold ${activeMode === "time" ? "text-[#131921]" : "text-gray-600"}`}>
              Time-Based
            </span>
            <span className="text-xs text-gray-500">
              {new Date().getHours() < 12 ? "Morning picks" : new Date().getHours() < 17 ? "Afternoon picks" : "Evening picks"}
            </span>
          </button>
        </div>

        {/* Context message */}
        {contextMsg && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 mb-5">
            <p className="text-sm text-gray-700">{contextMsg}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        )}

        {/* Cart Items */}
        {!loading && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-5">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-[#131921]">{itemCount} items in cart</h2>
              <button
                onClick={() => setShowBrowse(true)}
                className="px-4 py-2 bg-white border border-[#FF9900] text-[#FF9900] rounded-lg text-sm font-semibold hover:bg-[#FFF8F0] transition-colors"
              >
                + Add items
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <p className="text-lg mb-2">Your cart is empty</p>
                <button
                  onClick={() => setShowBrowse(true)}
                  className="text-sm font-medium text-[#007185] hover:underline"
                >
                  Browse items to add
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {cartItems.map((item, i) => (
                  <div key={i} className="px-5 py-4 flex items-center gap-4">
                    {/* Image */}
                    <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100">
                      <span className="text-2xl opacity-30">📦</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#131921]">{item.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-lg font-bold text-[#131921]">₹{item.price}</span>
                        <span className="text-xs text-[#067D62] font-medium flex items-center gap-0.5">
                          <Clock className="w-3 h-3" /> {item.delivery}
                        </span>
                      </div>
                      {item.reason && (
                        <p className="text-xs text-gray-500 mt-1">{item.reason}</p>
                      )}
                    </div>

                    {/* Qty + Delete */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button onClick={() => updateQty(i, -1)} className="px-3 py-2 hover:bg-gray-50">
                          <Minus className="w-3.5 h-3.5 text-gray-700" />
                        </button>
                        <span className="px-3 py-2 text-sm font-bold text-[#131921] min-w-[32px] text-center border-x border-gray-300">
                          {item.qty}
                        </span>
                        <button onClick={() => updateQty(i, 1)} className="px-3 py-2 hover:bg-gray-50">
                          <Plus className="w-3.5 h-3.5 text-gray-700" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(i)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Checkout */}
        {!loading && cartItems.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky bottom-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Subtotal ({itemCount} items)</p>
                <p className="text-3xl font-bold text-[#131921]">₹{total}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-[#067D62] font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>10 min delivery</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Free delivery above ₹199</p>
              </div>
            </div>
            <button
              onClick={() => setOrdered(true)}
              className="w-full py-4 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-xl text-base font-bold text-[#0F1111] transition-colors"
            >
              Proceed to Buy
            </button>
          </div>
        )}
      </div>

      {/* Browse Panel */}
      {showBrowse && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowBrowse(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-[650px] bg-[#f5f5f5] shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-[#131921]">Add items</h2>
              <button onClick={() => setShowBrowse(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="sticky top-[65px] bg-white border-b border-gray-100 px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar z-10">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setBrowseFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    browseFilter === cat
                      ? 'bg-[#131921] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredCatalog.map((product, i) => {
                const inCart = cartItems.find(c => c.name === product.name)
                return (
                  <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col">
                    <div className="w-full aspect-square bg-gray-50 rounded-xl mb-3 flex items-center justify-center border border-gray-100">
                      <span className="text-3xl opacity-25">📦</span>
                    </div>
                    <h3 className="text-xs font-semibold text-[#131921] leading-snug mb-1 line-clamp-2 min-h-[32px]">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3 text-[#067D62]" />
                      <span className="text-[10px] text-[#067D62] font-medium">{product.delivery}</span>
                    </div>
                    <p className="text-base font-bold text-[#131921] mb-3">₹{product.price}</p>
                    <div className="mt-auto">
                      {inCart ? (
                        <div className="flex items-center justify-center gap-1 bg-[#E8F5E9] border border-[#067D62] rounded-lg py-2">
                          <span className="text-xs font-bold text-[#067D62]">✓ Added ({inCart.qty})</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => addFromBrowse(product)}
                          className="w-full py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-lg text-sm font-bold text-[#0F1111] transition-colors"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
