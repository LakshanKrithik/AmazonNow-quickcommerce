// components/crisis/CrisisGrid.jsx - Crisis category tile grid (desktop web layout)
import { useCrisisStore } from "../../stores/useCrisisStore";
import {
  Wine,
  Baby,
  Plane,
  Pill,
  CloudRain,
  Zap,
  ChefHat,
  Dog
} from "lucide-react";

const CRISIS_TILES = [
  { id: "PARTY_CRISIS", label: "Party Crisis", categoryTag: "soft_drinks", Icon: Wine, color: "bg-orange-50 text-orange-600 border-orange-200 hover:border-orange-400" },
  { id: "BABY_CRISIS", label: "Baby Crisis", categoryTag: "baby_formula", Icon: Baby, color: "bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-400" },
  { id: "TRAVEL_CRISIS", label: "Travel Crisis", categoryTag: "travel_adapter", Icon: Plane, color: "bg-purple-50 text-purple-600 border-purple-200 hover:border-purple-400" },
  { id: "MEDICINE_CRISIS", label: "Medicine Crisis", categoryTag: "painkillers", Icon: Pill, color: "bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-400" },
  { id: "RAIN_CRISIS", label: "Rain Crisis", categoryTag: "umbrella", Icon: CloudRain, color: "bg-cyan-50 text-cyan-600 border-cyan-200 hover:border-cyan-400" },
  { id: "POWER_CUT_CRISIS", label: "Power Cut", categoryTag: "power_bank", Icon: Zap, color: "bg-amber-50 text-amber-600 border-amber-200 hover:border-amber-400" },
  { id: "COOKING_CRISIS", label: "Cooking Fix", categoryTag: "cooking_oil", Icon: ChefHat, color: "bg-rose-50 text-rose-600 border-rose-200 hover:border-rose-400" },
  { id: "PET_CRISIS", label: "Pet Emergency", categoryTag: "pet_treats", Icon: Dog, color: "bg-indigo-50 text-indigo-600 border-indigo-200 hover:border-indigo-400" },
];

export default function CrisisGrid() {
  const triggerCrisis = useCrisisStore((state) => state.triggerCrisis);
  const isLoading = useCrisisStore((state) => state.isLoading);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-4">
        Urgent Bundles
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {CRISIS_TILES.map((tile) => {
          const Icon = tile.Icon;
          return (
            <button
              key={tile.id}
              disabled={isLoading}
              onClick={() => triggerCrisis(tile.id, tile.categoryTag, false)}
              className={`flex flex-col items-start justify-between p-5 h-32 rounded-2xl border transition-all duration-200 hover:shadow-md active:scale-95 cursor-pointer ${tile.color} disabled:opacity-50 disabled:pointer-events-none`}
            >
              <div className="p-2.5 rounded-xl bg-white/80 shadow-sm">
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm tracking-tight">{tile.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
