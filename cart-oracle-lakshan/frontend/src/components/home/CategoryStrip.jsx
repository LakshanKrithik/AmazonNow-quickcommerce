import { useNavigate } from "react-router-dom"

const CATEGORIES = [
  { name: "Fruits & Vegetables", img: "🥬", slug: "fruits-vegetables" },
  { name: "Dairy & Bread", img: "🥛", slug: "dairy-bread" },
  { name: "Snacks & Chips", img: "🍿", slug: "snacks-chips" },
  { name: "Cold Drinks", img: "🥤", slug: "cold-drinks" },
  { name: "Instant Food", img: "🍜", slug: "instant-food" },
  { name: "Cleaning", img: "🧹", slug: "cleaning" },
  { name: "Personal Care", img: "🧴", slug: "personal-care" },
  { name: "Baby Care", img: "🍼", slug: "baby-care" },
  { name: "Pet Care", img: "🐕", slug: "pet-care" },
  { name: "Pharmacy", img: "💊", slug: "pharmacy" },
  { name: "Ice Cream", img: "🍦", slug: "ice-cream" },
  { name: "Bakery", img: "🍞", slug: "bakery" },
]

export default function CategoryStrip() {
  const navigate = useNavigate()

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-[#131921] mb-4">Shop by category</h2>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => navigate(`/category/${cat.slug}`)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-3xl group-hover:border-[#FF9900] group-hover:shadow-md transition-all">
              {cat.img}
            </div>
            <span className="text-xs text-gray-600 font-medium text-center leading-tight">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
