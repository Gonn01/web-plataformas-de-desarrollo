// src/pages/entidad_detalle/hooks/use-entidad-data.js

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
    fetchFinancialEntityById,
    createGasto,
    updateFinancialEntity,
    deleteFinancialEntity,
} from '@/services/api';
import useAuth from '@/hooks/use-auth';
import { useParams } from 'react-router-dom';

export function useEntidadData() {
    const { id } = useParams();
    const { token } = useAuth();

    const [entity, setEntity] = useState(null);
    const [loading, setLoading] = useState(true);

    // ------------------------------
    // LOAD ENTITY
    // ------------------------------
    useEffect(() => {
        if (!token) return;

        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchFinancialEntityById(id, token);
                setEntity(data);
            } catch (err) {
                console.error('Error cargando entidad', err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id, token]);

    // ------------------------------
    // STATS (solo lectura)
    // ------------------------------
    const stats = useMemo(() => {
        if (!entity) return { ars: 0, usd: 0, debts: 0 };

        let ars = 0;
        let usd = 0;

        const sumar = (g) => {
            const amount = Number(g.amount || 0);
            if (String(g.currency_type) === '1') ars += amount;
            if (String(g.currency_type) === '2') usd += amount;
        };

        entity.gastos_activos.forEach(sumar);
        entity.gastos_inactivos.forEach(sumar);

        return {
            ars,
            usd,
            debts: entity.gastos_activos.length,
        };
    }, [entity]);

    // ------------------------------
    // CREATE EXPENSE
    // ------------------------------
    const crearGastoEntidad = useCallback(
        async (payload) => {
            const nuevo = await createGasto(payload, token);

            const isFinalizado = Number(nuevo.payed_quotas) >= Number(nuevo.number_of_quotas);

            setEntity((prev) => ({
                ...prev,
                gastos_activos: isFinalizado
                    ? prev.gastos_activos
                    : [...prev.gastos_activos, nuevo],
                gastos_inactivos: isFinalizado
                    ? [...prev.gastos_inactivos, nuevo]
                    : prev.gastos_inactivos,
            }));

            return nuevo;
        },
        [token],
    );

    // ------------------------------
    // UPDATE ENTITY
    // ------------------------------
    const actualizarEntidad = useCallback(
        async (newName) => {
            await updateFinancialEntity(id, newName, token);
            setEntity((prev) => ({ ...prev, name: newName }));
        },
        [id, token],
    );

    // ------------------------------
    // DELETE ENTITY
    // ------------------------------
    const eliminarEntidad = useCallback(async () => {
        await deleteFinancialEntity(id, token);
    }, [id, token]);

    return {
        entity,
        stats,
        loading,
        crearGastoEntidad,
        actualizarEntidad,
        eliminarEntidad,
        setEntity,
    };
}
