import { useCallback } from 'react';
import useAuth from '@/hooks/use-auth';
import { createGasto } from '@/services/api';

export function useNewExpense(loadDashboard, closeModal) {
    const { token } = useAuth();

    const saveExpense = useCallback(
        async (payload) => {
            if (!token) return;

            try {
                const {
                    type,
                    name,
                    financial_entity_id,
                    amount,
                    currency_type,
                    is_fixed_expense,
                    is_installment,
                    installments,
                } = payload;

                const body = {
                    financial_entity_id,
                    name,
                    amount,
                    number_of_quotas: is_installment ? Number(installments) || 0 : 0,
                    currency_type,
                    first_quota_date: null,
                    fixed_expense: is_fixed_expense,
                    image: null,
                    type: type.toLowerCase() === 'me deben' ? 'ME_DEBEN' : 'DEBO',
                };

                await createGasto(body, token);

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
