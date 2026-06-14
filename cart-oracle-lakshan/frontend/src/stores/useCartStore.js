// stores/useCartStore.js - Cart state management (from Project B)
import { create } from 'zustand';

export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (asin) => set((state) => ({ items: state.items.filter(i => i.asin !== asin) })),
  clearCart: () => set({ items: [] }),
}));
