import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { MapPin, Search, ShoppingCart, ChevronDown, Loader2, Plus, Check, Clock, X, User, Calendar } from 'lucide-react'
import { useCartStore } from '../../stores/useCartStore'

const API_BASE = "http://localhost:8000"

export default function TopNav() {
  const cartItems = useCartStore(s => s.items)
  const addItem = useCartStore(s => s.addItem)
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0)
  const navigate = useNavigate()

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
      if (data.success && data.products) setSuggestions(data)
    } catch (err) { console.error(err) }
    finally { setSearching(false) }
  }

  const addSingleItem = (product) => {
    addItem({ name: product.name, price: product.price, delivery: product.delivery || "10 mins", rating: product.rating || 4.3, qty: product.quantity || 1 })
    setAddedItems(prev => ({ ...prev, [product.name]: true }))
  }

  const addAllSuggestions = () => { suggestions?.products?.forEach(p => addSingleItem(p)) }
  const closeSuggestions = () => { setSuggestions(null); setQuery("") }

  return (
    <>
      {/* Main Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-3 sm:gap-5">
          {/* Logo */}
          <NavLink to="/" className="shrink-0 flex items-baseline gap-0.5">
            <span className="text-[22px] font-extrabold text-[var(--dark)] tracking-tight">amazon</span>
            <span className="text-[var(--green)] font-bold text-xs">NOW</span>
          </NavLink>

          {/* Location */}
          <button className="hidden lg:flex items-center gap-2 text-left shrink-0 group">
            <MapPin className="w-4 h-4 text-[var(--green)]" />
            <div>
              <p className="text-[10px] text-gray-500 leading-none">Delivery in <span className="font-semibold text-[var(--green)]">10 minutes</span></p>
              <p className="text-sm font-semibold text-[var(--dark)] group-hover:text-[var(--green)] transition-colors">Anna Nagar, Chennai</p>
            </div>
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="flex h-11 rounded-xl border border-gray-300 overflow-hidden focus-within:border-[var(--green)] focus-within:ring-1 focus-within:ring-[var(--green)] transition-all bg-white">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search "milk", "party snacks", "groceries for the week"'
                className="flex-1 px-4 text-sm text-[var(--dark)] bg-transparent outline-none placeholder:text-gray-400"
              />
              <button type="submit" disabled={searching} className="px-4 bg-[var(--green)] hover:bg-[#0a6e1a] flex items-center justify-center transition-colors">
                {searching ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Search className="w-4 h-4 text-white" />}
              </button>
            </div>
          </form>

          {/* Account */}
          <button className="hidden sm:flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--dark)] shrink-0">
            <User className="w-5 h-5" />
            <span className="font-medium">Lakshan</span>
          </button>

          {/* Calendar */}
          <div className="relative group shrink-0">
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 text-gray-600 hover:text-[var(--green)] hover:bg-[var(--green-light)] rounded-xl transition-all"
            >
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium hidden md:inline">Calendar</span>
            </a>
            {/* Hover tooltip */}
            <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Upcoming Events</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-[var(--green)] rounded-full mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-[var(--dark)]">No events synced</p>
                    <p className="text-xs text-gray-500">Connect Google Calendar to see events</p>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-3 pt-2 border-t border-gray-100">Click to open Google Calendar →</p>
            </div>
          </div>

          {/* Cart */}
          <button onClick={() => navigate("/cart")} className="relative flex items-center gap-1.5 bg-[var(--green)] text-white px-4 py-2 rounded-xl hover:bg-[#0a6e1a] transition-colors shrink-0">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <>
                <span className="text-sm font-bold">{cartCount} items</span>
              </>
            )}
            {cartCount === 0 && <span className="text-sm font-medium">Cart</span>}
          </button>
        </div>

        {/* Sub Nav */}
        <div className="border-t border-gray-100 px-4 sm:px-6">
          <div className="max-w-[1400px] mx-auto flex items-center gap-0.5 h-10 text-[13px] overflow-x-auto no-scrollbar">
            {[
              { to: "/", label: "Home" },
              { to: "/cart", label: "Smart Cart" },
              { to: "/category/fresh", label: "Fresh" },
              { to: "/category/pantry", label: "Pantry" },
              { to: "/category/dairy-bread", label: "Dairy" },
              { to: "/category/snacks-chips", label: "Snacks" },
              { to: "/category/cold-drinks", label: "Beverages" },
              { to: "/category/pharmacy", label: "Pharmacy" },
              { to: "/category/baby-care", label: "Baby" },
              { to: "/category/ice-cream", label: "Ice Cream" },
              { to: "/admin", label: "Dashboard" },
            ].map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                  isActive ? 'bg-[var(--green-light)] text-[var(--green)]' : 'text-gray-600 hover:bg-gray-100 hover:text-[var(--dark)]'
                }`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Search Suggestions */}
      {suggestions && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={closeSuggestions} />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--dark)]">Results for "{query}"</p>
                <p className="text-xs text-gray-500 mt-0.5">{suggestions.summary}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={addAllSuggestions} className="px-4 py-1.5 bg-[var(--green)] text-white rounded-lg text-xs font-semibold hover:bg-[#0a6e1a]">Add all</button>
                <button onClick={closeSuggestions} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
              </div>
            </div>
            <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
              {suggestions.products.map((product, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-[var(--green-light)] rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-[var(--green)]">{product.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--dark)] truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-bold text-[var(--dark)]">₹{product.price}</span>
                      {product.quantity > 1 && <span className="text-xs text-gray-400">×{product.quantity}</span>}
                    </div>
                  </div>
                  {addedItems[product.name] ? (
                    <span className="text-xs font-semibold text-[var(--green)] bg-[var(--green-light)] px-3 py-1.5 rounded-lg">Added ✓</span>
                  ) : (
                    <button onClick={() => addSingleItem(product)} className="px-3 py-1.5 border border-[var(--green)] text-[var(--green)] text-xs font-semibold rounded-lg hover:bg-[var(--green)] hover:text-white transition-all">Add</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
