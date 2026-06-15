// components/suggestions/YourUsuals.jsx - Predicted routine purchases (desktop web)
import { useEffect, useState } from "react";
import { useCrisisStore } from "../../stores/useCrisisStore";
import { Clock, TrendingUp } from "lucide-react";

const API_BASE = "https://amazonnow-quickcommerce.onrender.com";

export default function YourUsuals() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const triggerCrisis = useCrisisStore((state) => state.triggerCrisis);

  useEffect(() => {
    const loadSuggestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/predictions/ajendra_001`);
        const data = await response.json();
        if (data.success) {
          setSuggestions(data.items || []);
        }
      } catch (error) {
        console.error("Failed to load suggestions", error);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestions();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 flex justify-center">
        <div className="w-8 h-8 border-3 border-[#FF9900] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-neutral-900">
          Your Usuals
        </h2>
        <span className="text-xs font-bold bg-[#FF9900]/10 text-[#FF9900] px-3 py-1.5 rounded-full border border-[#FF9900]/20">
          Predicted for You
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {suggestions.map((item) => (
          <button
            key={item.asin}
            onClick={() => triggerCrisis(item.macro_crisis, item.category, true)}
            className="text-left flex flex-col p-4 rounded-2xl border border-neutral-200 bg-white hover:border-[#FF9900] hover:shadow-lg transition-all duration-200 active:scale-[0.97]"
          >
            <div className="w-full h-28 bg-neutral-100 rounded-xl mb-3 overflow-hidden relative flex items-center justify-center">
              <span className="text-3xl font-black text-neutral-200 select-none">
                {item.brand.charAt(0)}
              </span>
              <img
                src={item.image_url}
                alt={item.product_name}
                onError={(e) => (e.currentTarget.style.display = 'none')}
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
              />
            </div>

            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1 line-clamp-1">
              {item.brand}
            </span>
            <h3 className="font-bold text-sm text-neutral-900 leading-snug mb-2 line-clamp-2 min-h-[40px]">
              {item.product_name}
            </h3>

            <div className="mt-auto w-full flex items-center justify-between pt-2 border-t border-neutral-100">
              <span className="text-sm font-extrabold tracking-tight">
                ₹{Math.round(item.base_price * item.surge_multiplier)}
              </span>
              <div className="flex items-center gap-1 text-neutral-400">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{item.eta_mins}m</span>
              </div>
            </div>

            {item.time_match_boost && (
              <div className="mt-2 w-full flex items-center gap-1 text-[#FF9900] bg-[#FF9900]/10 px-2 py-1 rounded text-[10px] font-bold">
                <TrendingUp className="w-3 h-3" />
                <span>Usual time!</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
