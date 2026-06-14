import { Star, Plus, Minus, Clock } from "lucide-react"
import { useCartStore } from "../../stores/useCartStore"

export default function ProductGrid({ title, subtitle, products }) {
  if (!products || products.length === 0) return null

  return (
    <div className="mb-8">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-[#131921]">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
    addItem({
      name: product.name,
      price: product.price,
      delivery: product.delivery,
      rating: product.rating,
      qty: 1
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col hover:shadow-lg transition-shadow relative">
      {/* Delivery badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-full px-2 py-0.5 z-10">
        <Clock className="w-3 h-3 text-[#067D62]" />
        <span className="text-[10px] font-semibold text-[#067D62]">{product.delivery}</span>
      </div>

      {/* Image */}
      <div className="w-full aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center">
        <span className="text-5xl opacity-30">📦</span>
      </div>

      {/* Info */}
      <h3 className="text-sm font-semibold text-[#131921] leading-snug mb-2 line-clamp-2 min-h-[40px]">
        {product.name}
      </h3>

      {/* Rating */}
      <div className="flex items-center gap-1.5 mb-3">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-[#FFA41C] text-[#FFA41C]' : 'fill-gray-200 text-gray-200'}`} />
          ))}
        </div>
        <span className="text-xs text-gray-500">{product.rating}</span>
      </div>

      {/* Price */}
      <p className="text-xl font-bold text-[#131921] mb-4">₹{product.price}</p>

      {/* Add/Qty */}
      <div className="mt-auto">
        {qty === 0 ? (
          <button onClick={handleAdd} className="w-full py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-xl text-sm font-bold text-[#0F1111] transition-colors shadow-sm">
            Add to cart
          </button>
        ) : (
          <div className="flex items-center justify-between bg-white border-2 border-[#FF9900] rounded-xl overflow-hidden">
            <button onClick={() => qty === 1 ? removeItem(product.name) : updateQty(product.name, -1)} className="px-4 py-2.5 hover:bg-gray-50">
              <Minus className="w-4 h-4 text-[#131921]" />
            </button>
            <span className="text-base font-bold text-[#131921]">{qty}</span>
            <button onClick={() => updateQty(product.name, 1)} className="px-4 py-2.5 hover:bg-gray-50">
              <Plus className="w-4 h-4 text-[#131921]" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
