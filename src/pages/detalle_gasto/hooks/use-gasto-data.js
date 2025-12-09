import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/use-auth';
import { pagarCuota as pagarCuota2 } from '@/services/api';
import { fetchGastoById, updateGasto, deleteGasto } from '@/services/api';

export function useGastoData() {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [gasto, setGasto] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        load();
    }, [id, token]);

    async function load() {
        try {
            setLoading(true);
            const res = await fetchGastoById(id, token);
            setGasto(res);
        } catch (err) {
            console.error('Error cargando gasto', err);
            navigate(`/app/entidades/${gasto.entidad}`);
        } finally {
            setLoading(false);
        }
    }

    async function actualizar(payload) {
        if (!gasto) return;
        setLoading(true);
        await updateGasto(gasto.id, payload, token);
        await load();
        setLoading(false);
    }

    async function pagarCuota() {
        if (!gasto) return;
        setLoading(true);
        await pagarCuota2(gasto.id, token);
        await load();
        setLoading(false);
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
        eliminar,
        load,
        loading,
    };
}
