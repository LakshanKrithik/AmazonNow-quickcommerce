import { NavLink } from 'react-router-dom';
import { MapPin, Search, ShoppingCart, User, ChevronDown } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';

export default function TopNav() {
  const cartItems = useCartStore((state) => state.items);

  return (
    <nav className="sticky top-0 z-50 bg-[#131921] text-white">
      {/* Main Nav */}
      <div className="max-w-[1400px] mx-auto px-4 h-[60px] flex items-center gap-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-1 shrink-0 pr-4 hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1">
          <span className="font-bold text-xl tracking-tight">amazon</span>
          <span className="text-[#FF9900] font-bold text-sm mt-2">now</span>
        </NavLink>

        {/* Delivery Location */}
        <button className="hidden md:flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1 shrink-0">
          <MapPin className="w-4 h-4 text-white" />
          <div className="text-left">
            <p className="text-[10px] text-gray-300 leading-none">Deliver to Lakshan</p>
            <p className="text-sm font-bold leading-tight">Chennai 600001</p>
          </div>
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-3xl">
          <div className="flex h-[40px] rounded-lg overflow-hidden">
            <select className="bg-[#f3f3f3] text-[#555] text-xs font-medium px-2 border-r border-gray-300 hidden sm:block cursor-pointer">
              <option>All</option>
              <option>Groceries</option>
              <option>Fresh</option>
              <option>Medicine</option>
            </select>
            <input
              type="text"
              placeholder="Search for groceries, essentials, and more"
              className="flex-1 px-4 text-sm text-[#111] bg-white outline-none placeholder:text-gray-500"
            />
            <button className="bg-[#febd69] hover:bg-[#f3a847] px-4 flex items-center justify-center transition-colors">
              <Search className="w-5 h-5 text-[#131921]" />
            </button>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-1">
          <button className="hidden sm:flex flex-col items-start hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1">
            <span className="text-[10px] text-gray-300">Hello, Lakshan</span>
            <span className="text-sm font-bold flex items-center gap-0.5">Account <ChevronDown className="w-3 h-3" /></span>
          </button>

          <NavLink to="/cart" className="flex items-center hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1 relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-0.5 left-4 bg-[#FF9900] text-[#131921] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartItems.length}
            </span>
            <span className="text-sm font-bold ml-1 hidden sm:inline">Cart</span>
          </NavLink>
        </div>
      </div>

      {/* Sub Nav */}
      <div className="bg-[#232f3e] px-4">
        <div className="max-w-[1400px] mx-auto flex items-center gap-1 h-[38px] text-sm overflow-x-auto no-scrollbar">
          <NavLink to="/" className={({ isActive }) => `px-3 py-1 rounded hover:bg-white/10 transition-colors whitespace-nowrap ${isActive ? 'font-bold text-white' : 'text-gray-200'}`}>
            Home
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => `px-3 py-1 rounded hover:bg-white/10 transition-colors whitespace-nowrap ${isActive ? 'font-bold text-white' : 'text-gray-200'}`}>
            Smart Cart
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => `px-3 py-1 rounded hover:bg-white/10 transition-colors whitespace-nowrap ${isActive ? 'font-bold text-white' : 'text-gray-200'}`}>
            Dashboard
          </NavLink>
          <span className="px-3 py-1 text-gray-200 cursor-pointer hover:bg-white/10 rounded whitespace-nowrap">Fresh</span>
          <span className="px-3 py-1 text-gray-200 cursor-pointer hover:bg-white/10 rounded whitespace-nowrap">Pantry</span>
          <span className="px-3 py-1 text-gray-200 cursor-pointer hover:bg-white/10 rounded whitespace-nowrap">Pharmacy</span>
          <span className="px-3 py-1 text-gray-200 cursor-pointer hover:bg-white/10 rounded whitespace-nowrap">Pet Supplies</span>
          <span className="px-3 py-1 text-gray-200 cursor-pointer hover:bg-white/10 rounded whitespace-nowrap">Baby</span>
        </div>
      </div>
    </nav>
  );
}
