import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/use-auth';
import { pagarCuota as pagarCuota2, refundCuota as refundCuota2, fetchGastoById, updateGasto, deleteGasto } from '@/services/api';

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
        await pagarCuota2(gasto.id, token);
        await load(true);
    }

    async function refundCuota() {
        if (!gasto) return;
        await refundCuota2(gasto.id, token);
        await load(true);
    }

    async function eliminar() {
        if (!gasto) return;
        setLoading(true);
        await deleteGasto(gasto.id, token);
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
