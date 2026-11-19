import { create } from "zustand";

interface UIState {
  sidebarMobileOpen: boolean;
  setSidebarMobileOpen: (open: boolean) => void;
  toggleSidebarMobile: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarMobileOpen: false,
  setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),
  toggleSidebarMobile: () =>
    set((state) => ({ sidebarMobileOpen: !state.sidebarMobileOpen })),
}));
