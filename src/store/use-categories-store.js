import { create } from 'zustand';
import { fetchCategories } from '@/services/api';

export const useCategoriesStore = create((set) => ({
    categories: [],
    loading: false,

    loadCategories: async (token) => {
        set({ loading: true });
        try {
            const data = await fetchCategories(token);
            set({ categories: data });
        } catch (err) {
            console.error('Error loading categories', err);
        } finally {
            set({ loading: false });
        }
    },

    addCategory: (category) => {
        set((state) => ({
            categories: [...state.categories, category],
        }));
    },

    updateCategory: (id, patch) => {
        set((state) => ({
            categories: state.categories.map((c) => (c.id == id ? { ...c, ...patch } : c)),
        }));
    },

    removeCategory: (id) => {
        set((state) => ({
            categories: state.categories.filter((c) => c.id != id),
        }));
    },
}));
