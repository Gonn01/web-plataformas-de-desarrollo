import { create } from 'zustand';

export const useCompartidosStore = create((set) => ({
    pendingCount: 0,
    setPendingCount: (count) => set({ pendingCount: count }),
}));
