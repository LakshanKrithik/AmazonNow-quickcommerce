import { useNavigate } from "react-router-dom"

const CATEGORIES = [
  { name: "Fresh", img: "🥬", slug: "fresh", bg: "bg-green-50" },
  { name: "Dairy", img: "🥛", slug: "dairy-bread", bg: "bg-blue-50" },
  { name: "Snacks", img: "🍿", slug: "snacks-chips", bg: "bg-amber-50" },
  { name: "Drinks", img: "🥤", slug: "cold-drinks", bg: "bg-pink-50" },
  { name: "Instant", img: "🍜", slug: "instant-food", bg: "bg-orange-50" },
  { name: "Cleaning", img: "🧹", slug: "cleaning", bg: "bg-cyan-50" },
  { name: "Personal", img: "🧴", slug: "personal-care", bg: "bg-purple-50" },
  { name: "Baby", img: "🍼", slug: "baby-care", bg: "bg-rose-50" },
  { name: "Pet", img: "🐕", slug: "pet-care", bg: "bg-yellow-50" },
  { name: "Pharmacy", img: "💊", slug: "pharmacy", bg: "bg-red-50" },
  { name: "Ice Cream", img: "🍦", slug: "ice-cream", bg: "bg-sky-50" },
  { name: "Bakery", img: "🍞", slug: "bakery", bg: "bg-stone-100" },
]

export default function CategoryStrip() {
  const navigate = useNavigate()

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-[var(--dark)] mb-4">Shop by category</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => navigate(`/category/${cat.slug}`)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className={`w-[60px] h-[60px] ${cat.bg} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm`}>
              {cat.img}
            </div>
            <span className="text-[11px] text-gray-600 font-medium text-center leading-tight group-hover:text-[var(--green)] transition-colors">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
