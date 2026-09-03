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

                // El backend ya marcó los items en la sesión; resincronizamos.
                useReconcileStore.getState().refreshAfterPayment();

                // Gastos compartidos: el pago queda a la espera de que la otra
                // persona lo confirme desde su sección de Compartidos.
                const algunoPendiente = updatedItems.some((it) => (it?.pending_quotas ?? 0) > 0);
                if (algunoPendiente) {
                    useSnackbarStore
                        .getState()
                        .show(
                            'Pago registrado. Espera la confirmación de la otra persona.',
                            'success',
                            'hourglass_top',
                        );
                }

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
