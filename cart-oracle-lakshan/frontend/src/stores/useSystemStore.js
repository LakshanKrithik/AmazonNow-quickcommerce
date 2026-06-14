// stores/useSystemStore.js - System state management (from Project B)
import { create } from 'zustand';

export const useSystemStore = create((set) => ({
  activeNudge: null,
  triggerNudge: (nudge) => set({ activeNudge: nudge }),
  clearNudge: () => set({ activeNudge: null }),
  isSearchFocused: false,
  setSearchFocused: (focused) => set({ isSearchFocused: focused }),
}));
