// stores/useCrisisStore.js - Crisis state management (from Project B)
import { create } from 'zustand';
import { useCartStore } from './useCartStore';

const API_BASE = "https://amazonnow-quickcommerce.onrender.com";

export const useCrisisStore = create((set, get) => ({
  isDrawerOpen: false,
  isLoading: false,
  activeCrisis: null,
  recommendedItems: [],
  selectedItems: {},

  updateItemQuantity: (item, delta) => set((state) => {
    const prevEntry = state.selectedItems[item.asin];
    const prevQty = prevEntry ? prevEntry.quantity : 0;
    const newQty = Math.max(0, prevQty + delta);

    const newSelectedItems = { ...state.selectedItems };

    if (newQty === 0) {
      delete newSelectedItems[item.asin];
    } else {
      newSelectedItems[item.asin] = { item, quantity: newQty };
    }

    return { selectedItems: newSelectedItems };
  }),

  // Fires when user speaks their problem or clicks a tile
  triggerCrisis: async (crisis, category, isSearch = false) => {
    set({ isLoading: true, activeCrisis: crisis, isDrawerOpen: true, selectedItems: {} });

    try {
      const response = await fetch(`${API_BASE}/api/inventory/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_category: category, macro_crisis: crisis, isSearch })
      });

      const data = await response.json();

      if (!data.success) throw new Error("Matchmaking failed");

      set({ recommendedItems: data.items || [], isLoading: false });
    } catch (error) {
      console.error("Failed to fetch crisis bundle:", error);
      set({ isLoading: false, recommendedItems: [], selectedItems: {} });
    }
  },

  closeDrawer: () => set({ isDrawerOpen: false, activeCrisis: null, recommendedItems: [], selectedItems: {} }),

  // Fires when you swipe to checkout
  resolveCrisis: () => {
    const { selectedItems } = get();
    const cartStore = useCartStore.getState();

    Object.values(selectedItems).forEach(({ item, quantity }) => {
      cartStore.addItem({ ...item, qty: quantity });
    });

    set({ isDrawerOpen: false });
  }
}));
