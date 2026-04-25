import { useCallback, useState } from 'react';
import useAuth from '@/hooks/use-auth';
import { createGasto } from '@/services/api';

export function useNewExpense(loadDashboard, closeModal) {
    const { token } = useAuth();
    const [saving, setSaving] = useState(false);

    const saveExpense = useCallback(
        async (payload) => {
            if (!token) return;

            setSaving(true);
            try {
                await createGasto(payload, token);

                closeModal();
                await loadDashboard();
            } catch (error) {
                console.error('Error creando gasto:', error);
                alert('No se pudo crear el gasto.');
            } finally {
                setSaving(false);
            }
        },
        [token, loadDashboard, closeModal],
    );

    return { saveExpense, saving };
}
