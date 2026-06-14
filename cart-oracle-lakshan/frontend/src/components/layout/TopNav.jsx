import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MapPin, Search, ShoppingCart, ChevronDown, Loader2, Plus, Check, Clock, X } from 'lucide-react'
import { useCartStore } from '../../stores/useCartStore'

const API_BASE = "http://localhost:8000"

export default function TopNav() {
  const cartItems = useCartStore(s => s.items)
  const addItem = useCartStore(s => s.addItem)
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0)

  const [query, setQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [suggestions, setSuggestions] = useState(null)
  const [addedItems, setAddedItems] = useState({})

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim() || searching) return

    setSearching(true)
    setSuggestions(null)
    setAddedItems({})

    try {
      const res = await fetch(`${API_BASE}/api/voice-cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: query })
      })
      const data = await res.json()
      if (data.success && data.products) {
        setSuggestions(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSearching(false)
    }
  }

  const addSingleItem = (product) => {
    addItem({
      name: product.name,
      price: product.price,
      delivery: product.delivery || "10 mins",
      rating: product.rating || 4.3,
      qty: product.quantity || 1
    })
    setAddedItems(prev => ({ ...prev, [product.name]: true }))
  }

  const addAllSuggestions = () => {
    if (suggestions?.products) {
      suggestions.products.forEach(p => addSingleItem(p))
    }
  }

  const closeSuggestions = () => {
    setSuggestions(null)
    setQuery("")
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#131921] text-white">
        <div className="max-w-[1400px] mx-auto px-4 h-[60px] flex items-center gap-4">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-1 shrink-0 pr-4 hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1">
            <span className="font-bold text-xl tracking-tight">amazon</span>
            <span className="text-[#FF9900] font-bold text-sm mt-2">now</span>
          </NavLink>

          {/* Location */}
          <button className="hidden md:flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1 shrink-0">
            <MapPin className="w-4 h-4" />
            <div className="text-left">
              <p className="text-[10px] text-gray-300 leading-none">Deliver to Lakshan</p>
              <p className="text-sm font-bold leading-tight">Chennai 600001</p>
            </div>
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-3xl">
            <div className="flex h-[40px] rounded-lg overflow-hidden">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search or describe what you need..."
                className="flex-1 px-4 text-sm text-[#111] bg-white outline-none placeholder:text-gray-500"
              />
              <button
                type="submit"
                disabled={searching}
                className="bg-[#febd69] hover:bg-[#f3a847] px-4 flex items-center justify-center transition-colors"
              >
                {searching ? <Loader2 className="w-5 h-5 text-[#131921] animate-spin" /> : <Search className="w-5 h-5 text-[#131921]" />}
              </button>
            </div>
          </form>

          {/* Right */}
          <div className="flex items-center gap-1">
            <button className="hidden sm:flex flex-col items-start hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1">
              <span className="text-[10px] text-gray-300">Hello, Lakshan</span>
              <span className="text-sm font-bold flex items-center gap-0.5">Account <ChevronDown className="w-3 h-3" /></span>
            </button>

            <NavLink to="/cart" className="flex items-center hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1 relative">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 left-4 bg-[#FF9900] text-[#131921] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="text-sm font-bold ml-1 hidden sm:inline">Cart</span>
            </NavLink>
          </div>
        </div>

        {/* Sub Nav */}
        <div className="bg-[#232f3e] px-4">
          <div className="max-w-[1400px] mx-auto flex items-center gap-1 h-[38px] text-sm overflow-x-auto no-scrollbar">
            <NavLink to="/" className={({ isActive }) => `px-3 py-1 rounded hover:bg-white/10 whitespace-nowrap ${isActive ? 'font-bold text-white' : 'text-gray-200'}`}>Home</NavLink>
            <NavLink to="/cart" className={({ isActive }) => `px-3 py-1 rounded hover:bg-white/10 whitespace-nowrap ${isActive ? 'font-bold text-white' : 'text-gray-200'}`}>Smart Cart</NavLink>
            <NavLink to="/admin" className={({ isActive }) => `px-3 py-1 rounded hover:bg-white/10 whitespace-nowrap ${isActive ? 'font-bold text-white' : 'text-gray-200'}`}>Dashboard</NavLink>
            <span className="px-3 py-1 text-gray-200 cursor-pointer hover:bg-white/10 rounded whitespace-nowrap">Fresh</span>
            <span className="px-3 py-1 text-gray-200 cursor-pointer hover:bg-white/10 rounded whitespace-nowrap">Pantry</span>
            <span className="px-3 py-1 text-gray-200 cursor-pointer hover:bg-white/10 rounded whitespace-nowrap">Pharmacy</span>
          </div>
        </div>
      </nav>

      {/* Search Suggestions Dropdown */}
      {suggestions && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/30" onClick={closeSuggestions} />
          <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-b-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#131921]">Suggested for "{query}"</p>
                <p className="text-xs text-gray-500">{suggestions.products.length} items • {suggestions.summary}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={addAllSuggestions} className="px-4 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-lg text-xs font-bold text-[#0F1111]">
                  Add all
                </button>
                <button onClick={closeSuggestions} className="p-1.5 hover:bg-gray-100 rounded-full">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-100">
              {suggestions.products.map((product, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-lg opacity-30">📦</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#131921] truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-bold text-[#131921]">₹{product.price}</span>
                      {product.quantity > 1 && <span className="text-xs text-gray-500">×{product.quantity}</span>}
                      <span className="text-xs text-[#067D62] flex items-center gap-0.5"><Clock className="w-3 h-3" />{product.delivery}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {addedItems[product.name] ? (
                      <div className="w-8 h-8 bg-[#067D62]/10 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-[#067D62]" />
                      </div>
                    ) : (
                      <button onClick={() => addSingleItem(product)} className="px-3 py-1.5 border border-[#FF9900] text-[#FF9900] hover:bg-[#FF9900] hover:text-white text-xs font-bold rounded-lg transition-all">
                        Add
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
