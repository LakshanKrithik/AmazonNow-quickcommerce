// components/showdown/ShowdownDrawer.jsx - Product comparison drawer (desktop web)
import { AnimatePresence, motion } from "framer-motion";
import { useCrisisStore } from "../../stores/useCrisisStore";
import ProductCard from "./ProductCard";
import SwipeToResolve from "../shared/SwipeToResolve";
import { X, ShieldAlert } from "lucide-react";

export default function ShowdownDrawer() {
  const isDrawerOpen = useCrisisStore((state) => state.isDrawerOpen);
  const recommendedItems = useCrisisStore((state) => state.recommendedItems);
  const selectedItems = useCrisisStore((state) => state.selectedItems);
  const updateItemQuantity = useCrisisStore((state) => state.updateItemQuantity);
  const isLoading = useCrisisStore((state) => state.isLoading);
  const closeDrawer = useCrisisStore((state) => state.closeDrawer);
  const resolveCrisis = useCrisisStore((state) => state.resolveCrisis);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black z-40"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-white rounded-t-[32px] shadow-2xl z-50 overflow-hidden border-t border-neutral-200"
          >
            <div className="w-12 h-1 bg-neutral-300 rounded-full mx-auto my-3" />

            <div className="px-6 pb-8 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-neutral-900" />
                  <h2 className="font-black text-lg text-neutral-900 tracking-tight">
                    Showdown Comparison
                  </h2>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-2 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-3 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-mono text-neutral-400">Computing weights...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendedItems.map((item, index) => {
                    const quantity = selectedItems[item.asin]?.quantity || 0;
                    return (
                      <ProductCard
                        key={item.asin}
                        item={item}
                        rank={index + 1}
                        quantity={quantity}
                        onUpdateQuantity={(delta) => updateItemQuantity(item, delta)}
                      />
                    );
                  })}

                  <div className="mt-6 pt-4 border-t border-neutral-100">
                    <SwipeToResolve onSuccess={resolveCrisis} />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
