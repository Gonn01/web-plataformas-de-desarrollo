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
        if (!entity) return { amount: 0, debts: 0, fixed: 0, finalized: 0 };

        let totalAmount = 0;
        let fixedCount = 0;

        const sumar = (g) => {
            const amount = Number(g.amount || 0);

            if (g.fixed_expense) fixedCount += 1;

            totalAmount += amount;
        };

        entity.gastos_activos.forEach(sumar);
        entity.gastos_inactivos.forEach(sumar);
        entity.gastos_fijos?.forEach(sumar);

        return {
            amount: totalAmount,
            debts: entity.gastos_activos.length,
            fixed: fixedCount,
            finalized: entity.gastos_inactivos.length,
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
