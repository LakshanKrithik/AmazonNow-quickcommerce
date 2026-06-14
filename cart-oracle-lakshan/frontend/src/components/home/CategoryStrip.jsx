const CATEGORIES = [
  { name: "Fruits & Vegetables", img: "🥬" },
  { name: "Dairy & Bread", img: "🥛" },
  { name: "Snacks & Chips", img: "🍿" },
  { name: "Cold Drinks", img: "🥤" },
  { name: "Instant Food", img: "🍜" },
  { name: "Cleaning", img: "🧹" },
  { name: "Personal Care", img: "🧴" },
  { name: "Baby Care", img: "🍼" },
  { name: "Pet Care", img: "🐕" },
  { name: "Pharmacy", img: "💊" },
  { name: "Ice Cream", img: "🍦" },
  { name: "Bakery", img: "🍞" },
]

export default function CategoryStrip() {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-[#131921] mb-4">Shop by category</h2>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
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
