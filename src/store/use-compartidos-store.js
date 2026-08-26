import { create } from 'zustand';
import { fetchCompartidos } from '@/services/api';

export const useCompartidosStore = create((set) => ({
    pendingCount: 0,
    setPendingCount: (count) => set({ pendingCount: count }),

    loadPendingCount: async (token) => {
        if (!token) return;
        try {
            const data = await fetchCompartidos(token);
            const count = data.recibidos.filter((r) => r.status === 'PENDING_APPROVAL').length;
            set({ pendingCount: count });
        } catch (err) {
            console.error('Error cargando compartidos pendientes', err);
        }
    },
}));
