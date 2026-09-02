import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '@/store/use-auth-store';
import {
    pagarCuota as pagarCuota2,
    refundCuota as refundCuota2,
    fetchGastoById,
    updateGasto,
    deleteGasto,
} from '@/services/api';
import { ensureReconcileActive } from '@/hooks/use-payments';
import { useReconcileStore } from '@/store/use-reconcile-store';
import { useSnackbarStore } from '@/store/use-snackbar-store';

export function useGastoData() {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [gasto, setGasto] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        load();
    }, [id, token]);

    async function load(silent = false) {
        try {
            if (!silent) setLoading(true);
            const res = await fetchGastoById(id, token);
            setGasto(res);
        } catch (err) {
            console.error('Error cargando gasto', err);
            navigate(`/app/entidades/${gasto.entidad}`);
        } finally {
            if (!silent) setLoading(false);
        }
    }

    async function actualizar(payload) {
        if (!gasto) return;
        await updateGasto(gasto.id, payload, token);
        await load(true);
    }

    async function pagarCuota() {
        if (!gasto) return;
        if (!ensureReconcileActive()) return;
        try {
            await pagarCuota2(gasto.id, token);
            useReconcileStore.getState().refreshAfterPayment();
            await load(true);
        } catch (err) {
            if (err?.response?.data?.code === 'RECONCILE_REQUIRED') {
                useSnackbarStore
                    .getState()
                    .show(
                        'Activá el modo "Hacer cuentas" para registrar pagos.',
                        'error',
                        'playlist_add_check',
                    );
            } else {
                useSnackbarStore.getState().show('No se pudo registrar el pago.', 'error');
            }
        }
    }

    async function refundCuota() {
        if (!gasto) return;
        await refundCuota2(gasto.id, token);
        await load(true);
    }

    async function eliminar(deleteLinked = false) {
        if (!gasto) return;
        setLoading(true);
        await deleteGasto(gasto.id, token, { deleteLinked });
        setLoading(false);
    }

    return {
        gasto,
        actualizar,
        pagarCuota,
        refundCuota,
        eliminar,
        load,
        loading,
    };
}
