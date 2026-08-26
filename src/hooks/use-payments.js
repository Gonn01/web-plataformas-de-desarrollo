import { useCallback } from 'react';
import { pagarCuota, pagarCuotasLote } from '@/services/api';

export function usePayments(token, onPaid) {
    const handleConfirm = useCallback(
        async (items) => {
            try {
                if (!items.length) return [];

                let updatedItems;
                if (items.length === 1) {
                    updatedItems = [await pagarCuota(items[0].id, token)];
                } else {
                    const ids = items.map((it) => it.id);

                    const { updated } = await pagarCuotasLote(ids, token);
                    updatedItems = updated;
                }

                onPaid?.();
                return updatedItems;
            } catch (err) {
                console.error('Error pagando cuotas:', err);
                alert('No se pudo registrar el pago.');
                return [];
            }
        },
        [onPaid, token],
    );

    return { handleConfirm };
}
