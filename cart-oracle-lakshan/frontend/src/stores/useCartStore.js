// stores/useCartStore.js - Global cart state
import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],

  addItem: (product) => {
    const { items } = get();
    const existing = items.findIndex(i => i.name === product.name);
    if (existing >= 0) {
      const updated = [...items];
      updated[existing] = { ...updated[existing], qty: updated[existing].qty + (product.qty || 1) };
      set({ items: updated });
    } else {
      set({ items: [...items, { ...product, qty: product.qty || 1 }] });
    }
  },

  addMultiple: (products) => {
    products.forEach(p => get().addItem(p));
  },

  updateQty: (name, delta) => {
    const { items } = get();
    const updated = items.map(item =>
      item.name === name ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    );
    set({ items: updated });
  },

  removeItem: (name) => {
    set({ items: get().items.filter(i => i.name !== name) });
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => get().items.reduce((sum, i) => sum + (i.price * i.qty), 0),
  getCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
}));
