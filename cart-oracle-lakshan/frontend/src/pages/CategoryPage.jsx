import { useParams } from "react-router-dom"
import { Star, Plus, Minus, Clock } from "lucide-react"
import { useCartStore } from "../stores/useCartStore"

// Product catalog by category
const CATEGORY_PRODUCTS = {
  "fruits-vegetables": {
    title: "Fruits & Vegetables",
    items: [
      { name: "Banana (6 pcs)", price: 40, delivery: "8 mins", rating: 4.5 },
      { name: "Tomato 500g", price: 30, delivery: "8 mins", rating: 4.3 },
      { name: "Onion 1kg", price: 40, delivery: "8 mins", rating: 4.4 },
      { name: "Potato 1kg", price: 35, delivery: "8 mins", rating: 4.5 },
      { name: "Apple (4 pcs)", price: 120, delivery: "10 mins", rating: 4.6 },
      { name: "Spinach Bunch", price: 25, delivery: "8 mins", rating: 4.2 },
      { name: "Carrot 500g", price: 35, delivery: "8 mins", rating: 4.3 },
      { name: "Cucumber 500g", price: 25, delivery: "8 mins", rating: 4.4 },
      { name: "Lemon (6 pcs)", price: 20, delivery: "8 mins", rating: 4.5 },
      { name: "Green Chilli 100g", price: 10, delivery: "8 mins", rating: 4.2 },
      { name: "Coriander Bunch", price: 10, delivery: "8 mins", rating: 4.3 },
      { name: "Mango (2 pcs)", price: 80, delivery: "10 mins", rating: 4.7 },
    ]
  },
  "dairy-bread": {
    title: "Dairy & Bread",
    items: [
      { name: "Amul Taaza Milk 1L", price: 72, delivery: "8 mins", rating: 4.5 },
      { name: "Britannia Bread", price: 45, delivery: "8 mins", rating: 4.3 },
      { name: "Amul Butter 100g", price: 56, delivery: "8 mins", rating: 4.6 },
      { name: "Eggs (6 pack)", price: 55, delivery: "10 mins", rating: 4.4 },
      { name: "Paneer 200g", price: 80, delivery: "10 mins", rating: 4.4 },
      { name: "Curd 400g", price: 40, delivery: "8 mins", rating: 4.4 },
      { name: "Cheese Slices 100g", price: 65, delivery: "10 mins", rating: 4.5 },
      { name: "Amul Cream 200ml", price: 55, delivery: "10 mins", rating: 4.3 },
      { name: "Mother Dairy Milk 500ml", price: 33, delivery: "8 mins", rating: 4.4 },
      { name: "Brown Bread", price: 50, delivery: "8 mins", rating: 4.2 },
      { name: "Pav Bread (8 pcs)", price: 30, delivery: "8 mins", rating: 4.3 },
      { name: "Yogurt Cup 100g", price: 25, delivery: "8 mins", rating: 4.4 },
    ]
  },
  "snacks-chips": {
    title: "Snacks & Chips",
    items: [
      { name: "Lays Magic Masala 115g", price: 50, delivery: "8 mins", rating: 4.5 },
      { name: "Kurkure Masala Munch", price: 20, delivery: "8 mins", rating: 4.3 },
      { name: "Haldirams Bhujia 200g", price: 65, delivery: "10 mins", rating: 4.6 },
      { name: "Dark Fantasy Choco Fills", price: 40, delivery: "8 mins", rating: 4.7 },
      { name: "Oreo Biscuits", price: 30, delivery: "8 mins", rating: 4.5 },
      { name: "Hide & Seek Biscuit", price: 35, delivery: "8 mins", rating: 4.5 },
      { name: "Parle-G Family Pack", price: 45, delivery: "8 mins", rating: 4.6 },
      { name: "Bingo Tedhe Medhe", price: 20, delivery: "8 mins", rating: 4.3 },
      { name: "Pringles Original 110g", price: 149, delivery: "10 mins", rating: 4.6 },
      { name: "Cornitos Nachos 150g", price: 99, delivery: "10 mins", rating: 4.4 },
      { name: "Too Yumm Multigrain", price: 30, delivery: "8 mins", rating: 4.2 },
      { name: "Act II Popcorn", price: 40, delivery: "8 mins", rating: 4.3 },
    ]
  },
  "cold-drinks": {
    title: "Cold Drinks & Beverages",
    items: [
      { name: "Coca-Cola 750ml", price: 40, delivery: "8 mins", rating: 4.4 },
      { name: "Thums Up 2L", price: 90, delivery: "10 mins", rating: 4.5 },
      { name: "Sprite 750ml", price: 40, delivery: "8 mins", rating: 4.3 },
      { name: "Real Mango Juice 1L", price: 99, delivery: "10 mins", rating: 4.4 },
      { name: "Bisleri Water 5L", price: 55, delivery: "8 mins", rating: 4.2 },
      { name: "Red Bull 250ml", price: 125, delivery: "8 mins", rating: 4.3 },
      { name: "Sting Energy 250ml", price: 20, delivery: "8 mins", rating: 4.1 },
      { name: "Paper Boat Aamras 200ml", price: 30, delivery: "8 mins", rating: 4.5 },
      { name: "Cold Coffee Tropicana 200ml", price: 35, delivery: "8 mins", rating: 4.3 },
      { name: "Maaza 600ml", price: 35, delivery: "8 mins", rating: 4.4 },
      { name: "Pepsi 750ml", price: 40, delivery: "8 mins", rating: 4.3 },
      { name: "Mountain Dew 750ml", price: 40, delivery: "8 mins", rating: 4.2 },
    ]
  },
  "instant-food": {
    title: "Instant Food",
    items: [
      { name: "Maggi 12 Pack", price: 120, delivery: "8 mins", rating: 4.6 },
      { name: "Cup Noodles Masala", price: 45, delivery: "8 mins", rating: 4.3 },
      { name: "Knorr Soup Tomato", price: 45, delivery: "10 mins", rating: 4.2 },
      { name: "Maggi Hot Heads", price: 35, delivery: "8 mins", rating: 4.2 },
      { name: "Top Ramen Curry", price: 14, delivery: "8 mins", rating: 4.1 },
      { name: "MTR Ready Rice", price: 75, delivery: "10 mins", rating: 4.3 },
      { name: "MTR Dal Makhani", price: 70, delivery: "10 mins", rating: 4.4 },
      { name: "Saffola Oats 1kg", price: 170, delivery: "10 mins", rating: 4.5 },
      { name: "Poha 500g", price: 40, delivery: "8 mins", rating: 4.3 },
      { name: "Upma Mix MTR", price: 55, delivery: "10 mins", rating: 4.2 },
    ]
  },
  "cleaning": {
    title: "Cleaning & Household",
    items: [
      { name: "Surf Excel Liquid 1L", price: 199, delivery: "12 mins", rating: 4.5 },
      { name: "Vim Liquid 500ml", price: 99, delivery: "10 mins", rating: 4.4 },
      { name: "Harpic Toilet Cleaner", price: 85, delivery: "10 mins", rating: 4.3 },
      { name: "Colin Glass Cleaner", price: 75, delivery: "10 mins", rating: 4.2 },
      { name: "Lizol Floor Cleaner 1L", price: 145, delivery: "12 mins", rating: 4.4 },
      { name: "Scotch-Brite Scrub Pad", price: 30, delivery: "8 mins", rating: 4.5 },
      { name: "Garbage Bags (30 pcs)", price: 80, delivery: "10 mins", rating: 4.2 },
      { name: "Tissue Paper Roll", price: 35, delivery: "8 mins", rating: 4.3 },
    ]
  },
  "personal-care": {
    title: "Personal Care",
    items: [
      { name: "Dettol Handwash 200ml", price: 65, delivery: "10 mins", rating: 4.4 },
      { name: "Colgate Toothpaste 150g", price: 90, delivery: "10 mins", rating: 4.5 },
      { name: "Head & Shoulders 180ml", price: 195, delivery: "10 mins", rating: 4.3 },
      { name: "Dove Soap 100g", price: 55, delivery: "8 mins", rating: 4.6 },
      { name: "Nivea Body Lotion 200ml", price: 199, delivery: "12 mins", rating: 4.4 },
      { name: "Gillette Razor", price: 85, delivery: "10 mins", rating: 4.3 },
      { name: "Whisper Ultra (8 pads)", price: 85, delivery: "10 mins", rating: 4.5 },
      { name: "Vaseline 100ml", price: 95, delivery: "10 mins", rating: 4.4 },
    ]
  },
  "baby-care": {
    title: "Baby Care",
    items: [
      { name: "Pampers Diapers (10 pcs)", price: 250, delivery: "12 mins", rating: 4.5 },
      { name: "MamyPoko Pants Medium", price: 599, delivery: "12 mins", rating: 4.4 },
      { name: "Johnson's Baby Wipes 72pcs", price: 180, delivery: "10 mins", rating: 4.5 },
      { name: "Cerelac Stage 1 300g", price: 250, delivery: "12 mins", rating: 4.6 },
      { name: "Himalaya Baby Cream 100ml", price: 120, delivery: "10 mins", rating: 4.4 },
      { name: "Baby Powder Johnson 200g", price: 140, delivery: "10 mins", rating: 4.3 },
      { name: "Feeding Bottle 250ml", price: 199, delivery: "12 mins", rating: 4.2 },
      { name: "Diaper Rash Cream 50g", price: 150, delivery: "10 mins", rating: 4.4 },
    ]
  },
  "pet-care": {
    title: "Pet Care",
    items: [
      { name: "Pedigree Adult 3kg", price: 780, delivery: "15 mins", rating: 4.4 },
      { name: "Drools Dog Food 3kg", price: 650, delivery: "15 mins", rating: 4.3 },
      { name: "Whiskas Cat Food 480g", price: 199, delivery: "12 mins", rating: 4.5 },
      { name: "Dog Biscuits 500g", price: 150, delivery: "12 mins", rating: 4.3 },
      { name: "Cat Litter 5kg", price: 350, delivery: "15 mins", rating: 4.2 },
      { name: "Pet Shampoo 200ml", price: 250, delivery: "12 mins", rating: 4.3 },
      { name: "Chew Toy for Dogs", price: 199, delivery: "12 mins", rating: 4.4 },
      { name: "Tick Spray 100ml", price: 180, delivery: "12 mins", rating: 4.1 },
    ]
  },
  "pharmacy": {
    title: "Pharmacy & Health",
    items: [
      { name: "Dolo-650 Strip", price: 30, delivery: "10 mins", rating: 4.8 },
      { name: "Crocin Advance Strip", price: 25, delivery: "10 mins", rating: 4.6 },
      { name: "Band-Aid 10pcs", price: 45, delivery: "10 mins", rating: 4.4 },
      { name: "Eno Sachet 5g (5 pcs)", price: 25, delivery: "8 mins", rating: 4.5 },
      { name: "Vicks VapoRub 25ml", price: 80, delivery: "10 mins", rating: 4.6 },
      { name: "ORS Sachets (5 pcs)", price: 30, delivery: "8 mins", rating: 4.4 },
      { name: "Dettol Antiseptic 60ml", price: 50, delivery: "10 mins", rating: 4.5 },
      { name: "Strepsils Lozenges 8pcs", price: 50, delivery: "10 mins", rating: 4.3 },
      { name: "Betadine 15ml", price: 55, delivery: "10 mins", rating: 4.4 },
      { name: "Moov Pain Spray 80g", price: 200, delivery: "10 mins", rating: 4.3 },
    ]
  },
  "fresh": {
    title: "Fresh & Daily",
    items: [
      { name: "Amul Taaza Milk 1L", price: 72, delivery: "8 mins", rating: 4.5 },
      { name: "Bread White", price: 45, delivery: "8 mins", rating: 4.3 },
      { name: "Eggs (6 pack)", price: 55, delivery: "10 mins", rating: 4.4 },
      { name: "Banana (6 pcs)", price: 40, delivery: "8 mins", rating: 4.5 },
      { name: "Curd 400g", price: 40, delivery: "8 mins", rating: 4.4 },
      { name: "Paneer 200g", price: 80, delivery: "10 mins", rating: 4.4 },
      { name: "Tomato 500g", price: 30, delivery: "8 mins", rating: 4.3 },
      { name: "Onion 1kg", price: 40, delivery: "8 mins", rating: 4.4 },
    ]
  },
  "pantry": {
    title: "Pantry Staples",
    items: [
      { name: "Tata Salt 1kg", price: 28, delivery: "8 mins", rating: 4.7 },
      { name: "Fortune Oil 1L", price: 145, delivery: "12 mins", rating: 4.4 },
      { name: "Aashirvaad Atta 5kg", price: 280, delivery: "15 mins", rating: 4.6 },
      { name: "Toor Dal 1kg", price: 160, delivery: "12 mins", rating: 4.4 },
      { name: "Basmati Rice 1kg", price: 120, delivery: "12 mins", rating: 4.5 },
      { name: "Sugar 1kg", price: 45, delivery: "10 mins", rating: 4.5 },
      { name: "MDH Chana Masala", price: 55, delivery: "10 mins", rating: 4.4 },
      { name: "Tata Tea Gold 500g", price: 250, delivery: "10 mins", rating: 4.6 },
      { name: "Nescafe Classic 100g", price: 280, delivery: "10 mins", rating: 4.5 },
      { name: "Saffola Oil 1L", price: 185, delivery: "12 mins", rating: 4.3 },
    ]
  },
  "ice-cream": {
    title: "Ice Cream & Frozen",
    items: [
      { name: "Amul Vanilla Tub 500ml", price: 150, delivery: "10 mins", rating: 4.5 },
      { name: "Kwality Walls Cornetto", price: 40, delivery: "10 mins", rating: 4.4 },
      { name: "Magnum Almond 100ml", price: 99, delivery: "10 mins", rating: 4.6 },
      { name: "Baskin Robbins Tub 500ml", price: 299, delivery: "12 mins", rating: 4.7 },
      { name: "Frozen Peas 500g", price: 60, delivery: "10 mins", rating: 4.3 },
      { name: "Frozen Parathas (5 pcs)", price: 80, delivery: "10 mins", rating: 4.2 },
      { name: "Ice Cream Sandwich", price: 30, delivery: "10 mins", rating: 4.4 },
      { name: "Chocobar (5 pcs)", price: 100, delivery: "10 mins", rating: 4.5 },
    ]
  },
  "bakery": {
    title: "Bakery & Cakes",
    items: [
      { name: "Chocolate Cake Slice", price: 80, delivery: "10 mins", rating: 4.5 },
      { name: "Croissant (2 pcs)", price: 90, delivery: "10 mins", rating: 4.4 },
      { name: "Veg Puff (2 pcs)", price: 40, delivery: "8 mins", rating: 4.3 },
      { name: "Garlic Bread", price: 60, delivery: "10 mins", rating: 4.4 },
      { name: "Muffin Chocolate", price: 50, delivery: "10 mins", rating: 4.5 },
      { name: "Cookies Pack (10 pcs)", price: 70, delivery: "10 mins", rating: 4.3 },
      { name: "Brownie (2 pcs)", price: 80, delivery: "10 mins", rating: 4.6 },
      { name: "Pizza Base (2 pcs)", price: 60, delivery: "10 mins", rating: 4.2 },
    ]
  },
}

export default function CategoryPage() {
  const { slug } = useParams()
  const category = CATEGORY_PRODUCTS[slug]
  const items = useCartStore(s => s.items)
  const addItem = useCartStore(s => s.addItem)
  const updateQty = useCartStore(s => s.updateQty)
  const removeItem = useCartStore(s => s.removeItem)

  if (!category) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-12 text-center">
        <h1 className="text-xl font-bold text-[#131921] mb-2">Category not found</h1>
        <p className="text-gray-500">This category is coming soon.</p>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 pb-24">
      <h1 className="text-2xl font-bold text-[#131921] mb-1">{category.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{category.items.length} products available</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {category.items.map((product, i) => {
          const inCart = items.find(it => it.name === product.name)
          const qty = inCart?.qty || 0

          return (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col hover:shadow-lg transition-shadow relative">
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 border border-gray-100 rounded-full px-2 py-0.5">
                <Clock className="w-3 h-3 text-[#067D62]" />
                <span className="text-[10px] font-semibold text-[#067D62]">{product.delivery}</span>
              </div>

              <div className="w-full aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-4xl opacity-25">📦</span>
              </div>

              <h3 className="text-sm font-semibold text-[#131921] leading-snug mb-2 line-clamp-2 min-h-[40px]">{product.name}</h3>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className={`w-3 h-3 ${j < Math.floor(product.rating) ? 'fill-[#FFA41C] text-[#FFA41C]' : 'fill-gray-200 text-gray-200'}`} />
                ))}
                <span className="text-xs text-gray-500 ml-0.5">{product.rating}</span>
              </div>

              <p className="text-xl font-bold text-[#131921] mb-4">₹{product.price}</p>

              <div className="mt-auto">
                {qty === 0 ? (
                  <button
                    onClick={() => addItem({ name: product.name, price: product.price, delivery: product.delivery, rating: product.rating, qty: 1 })}
                    className="w-full py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-xl text-sm font-bold text-[#0F1111] transition-colors"
                  >
                    Add to cart
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-white border-2 border-[#FF9900] rounded-xl overflow-hidden">
                    <button onClick={() => qty === 1 ? removeItem(product.name) : updateQty(product.name, -1)} className="px-4 py-2.5 hover:bg-gray-50">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-base font-bold text-[#131921]">{qty}</span>
                    <button onClick={() => updateQty(product.name, 1)} className="px-4 py-2.5 hover:bg-gray-50">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
