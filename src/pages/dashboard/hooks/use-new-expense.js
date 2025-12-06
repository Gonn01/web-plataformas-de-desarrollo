// src/pages/dashboard/hooks/use-new-expense.js
import { useCallback } from 'react';
import useAuth from '@/hooks/use-auth';
import { createGasto } from '@/services/api';

export function useNewExpense(loadDashboard, closeModal) {
    const { token } = useAuth();

    const saveExpense = useCallback(
        async (payload) => {
            if (!token) return;

            try {
                await createGasto(payload, token);

                closeModal();
                await loadDashboard();
            } catch (error) {
                console.error('Error creando gasto:', error);
                alert('No se pudo crear el gasto.');
            }
        },
        [token, loadDashboard, closeModal],
    );

    return { saveExpense };
}
