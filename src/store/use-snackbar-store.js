import { create } from 'zustand';

let idSeq = 0;

/**
 * Snackbar global. Cualquier parte de la app (incluidos stores / hooks fuera
 * de React) puede disparar un mensaje con:
 *   useSnackbarStore.getState().show('texto', 'error')
 */
export const useSnackbarStore = create((set) => ({
    current: null, // { id, message, type, icon }

    show: (message, type = 'success', icon) => {
        idSeq += 1;
        set({ current: { id: idSeq, message, type, icon } });
    },

    hide: () => set({ current: null }),
}));
