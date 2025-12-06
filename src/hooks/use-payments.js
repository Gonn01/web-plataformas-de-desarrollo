import { useCallback } from 'react';
import { pagarCuota, pagarCuotasLote } from '@/services/api';

export function usePayments(token, onPaid) {
    const handleConfirm = useCallback(
        async (items) => {
            try {
                if (!items.length) return;

                if (items.length === 1) {
                    await pagarCuota(items[0].id, token);
                } else {
                    const ids = items.map((it) => it.id);
                    await pagarCuotasLote(ids, token);
                }

                onPaid?.();
            } catch (err) {
                console.error('Error pagando cuotas:', err);
                alert('No se pudo registrar el pago.');
            }
        },
        [onPaid, token],
    );

    return { handleConfirm };
}
