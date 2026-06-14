import { Star, Plus, Minus, Clock } from "lucide-react"
import { useCartStore } from "../../stores/useCartStore"

export default function ProductGrid({ title, subtitle, products }) {
  if (!products || products.length === 0) return null

  return (
    <div className="mb-8">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--dark)]">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {products.map((product, i) => (
          <ProductCard key={i} product={product} />
        ))}
      </div>
    </div>
  )
}

function ProductCard({ product }) {
  const items = useCartStore(s => s.items)
  const addItem = useCartStore(s => s.addItem)
  const updateQty = useCartStore(s => s.updateQty)
  const removeItem = useCartStore(s => s.removeItem)

  const inCart = items.find(i => i.name === product.name)
  const qty = inCart?.qty || 0

  const handleAdd = () => {
    addItem({ name: product.name, price: product.price, delivery: product.delivery, rating: product.rating, qty: 1 })
  }

  // Generate a consistent color from product name
  const colors = ["bg-amber-50", "bg-sky-50", "bg-rose-50", "bg-emerald-50", "bg-violet-50", "bg-orange-50"]
  const colorIndex = product.name.length % colors.length
  const bgColor = colors[colorIndex]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-shadow relative">
      {/* Image area */}
      <div className={`relative w-full aspect-[4/3] ${bgColor} rounded-xl mb-3 flex items-center justify-center overflow-hidden`}>
        <span className="text-3xl font-bold text-black/5 select-none">{product.name.substring(0, 2).toUpperCase()}</span>
        {/* Delivery badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-white rounded-md px-1.5 py-0.5 shadow-sm">
          <Clock className="w-2.5 h-2.5 text-[var(--green)]" />
          <span className="text-[9px] font-semibold text-[var(--green)]">{product.delivery}</span>
        </div>
      </div>

      {/* Info */}
      <h3 className="text-[13px] font-medium text-[var(--dark)] leading-snug mb-1 line-clamp-2 min-h-[36px]">
        {product.name}
      </h3>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-2">
        <Star className="w-3 h-3 fill-[#FFA41C] text-[#FFA41C]" />
        <span className="text-[11px] text-gray-500 font-medium">{product.rating}</span>
      </div>

      {/* Price + Button */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-base font-bold text-[var(--dark)]">₹{product.price}</span>

        {qty === 0 ? (
          <button
            onClick={handleAdd}
            className="flex items-center gap-0.5 px-3 py-1.5 border-2 border-[var(--green)] text-[var(--green)] rounded-lg text-xs font-bold hover:bg-[var(--green)] hover:text-white transition-all"
          >
            ADD
          </button>
        ) : (
          <div className="flex items-center border-2 border-[var(--green)] bg-[var(--green)] rounded-lg overflow-hidden">
            <button onClick={() => qty === 1 ? removeItem(product.name) : updateQty(product.name, -1)} className="px-2 py-1.5 text-white hover:bg-[#0a6e1a]">
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2.5 py-1.5 text-xs font-bold text-white min-w-[20px] text-center">{qty}</span>
            <button onClick={() => updateQty(product.name, 1)} className="px-2 py-1.5 text-white hover:bg-[#0a6e1a]">
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
