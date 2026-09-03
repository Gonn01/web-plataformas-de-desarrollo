import { useCallback } from 'react';
import { pagarCuota, pagarCuotasLote } from '@/services/api';
import { useReconcileStore } from '@/store/use-reconcile-store';
import { useSnackbarStore } from '@/store/use-snackbar-store';

const RECONCILE_MSG = 'Activá el modo "Hacer cuentas" para registrar pagos.';

export function ensureReconcileActive() {
    if (useReconcileStore.getState().active) return true;
    useSnackbarStore.getState().show(RECONCILE_MSG, 'error', 'playlist_add_check');
    return false;
}

export function usePayments(token, onPaid) {
    const handleConfirm = useCallback(
        async (items) => {
            try {
                if (!items.length) return [];
                if (!ensureReconcileActive()) return [];

                let updatedItems;
                if (items.length === 1) {
                    updatedItems = [await pagarCuota(items[0].id, token)];
                } else {
                    const ids = items.map((it) => it.id);

                    const { updated } = await pagarCuotasLote(ids, token);
                    updatedItems = updated;
                }

                // El backend marcó los items en la sesión; resincronizamos.
                // El pago real se registra al terminar las cuentas.
                useReconcileStore.getState().refreshAfterPayment();

                useSnackbarStore
                    .getState()
                    .show(
                        updatedItems.length === 1
                            ? 'Gasto marcado. Se registra al terminar las cuentas.'
                            : `${updatedItems.length} gastos marcados. Se registran al terminar las cuentas.`,
                        'success',
                        'playlist_add_check',
                    );

                onPaid?.();
                return updatedItems;
            } catch (err) {
                console.error('Error pagando cuotas:', err);
                const code = err?.response?.data?.code;
                if (code === 'RECONCILE_REQUIRED') {
                    useSnackbarStore.getState().show(RECONCILE_MSG, 'error', 'playlist_add_check');
                } else if (code === 'GASTO_POSTERGADO') {
                    useSnackbarStore
                        .getState()
                        .show(
                            'Ese gasto está postergado para la próxima sesión de cuentas.',
                            'error',
                            'schedule',
                        );
                } else {
                    useSnackbarStore.getState().show('No se pudo registrar el pago.', 'error');
                }
                return [];
            }
        },
        [onPaid, token],
    );

    return { handleConfirm };
}
