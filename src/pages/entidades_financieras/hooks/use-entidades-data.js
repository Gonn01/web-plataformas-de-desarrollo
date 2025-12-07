// src/pages/entidades_financieras/hooks/use-entidades-data.js

import { useEffect, useState } from 'react';
import { fetchFinancialEntities, createEntity, deleteFinancialEntity } from '@/services/api';
import useAuth from '@/hooks/use-auth';
import { useEntitiesStore } from '@/store/use-entities-store';

export function useEntidadesData() {
    const { token } = useAuth();
    const [entities, setEntities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addEntity } = useEntitiesStore();

    /* useEffect(() => {
        if (!token) return;

        const load = async () => {
            try {
                const data = await fetchFinancialEntities(token);

                const normalized = data.map((e) => ({
                    ...e,
                    balances: e.balances ?? [{ currency: 'ARS', amount: 0 }],
                    activeExpenses: e.activeExpenses ?? 0,
                    type: e.type ?? 'bank',
                }));

                setEntities(normalized);
            } catch (err) {
                console.error('Error fetching entities:', err);
            }
        };

        load();
    }, [token]);
 */
    useEffect(() => {
        if (!token) return;

        const load = async () => {
            try {
                setLoading(true); // 👈 SE USA

                const data = await fetchFinancialEntities(token);

                const normalized = data.map((e) => ({
                    ...e,
                    balances: e.balances ?? [{ currency: 'ARS', amount: 0 }],
                    activeExpenses: e.activeExpenses ?? 0,
                    type: e.type ?? 'bank',
                }));

                setEntities(normalized);
            } catch (err) {
                console.error('Error fetching entities:', err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [token]);
    async function crearEntidad({ name }) {
        const newEntity = await createEntity({ name }, token);
        setEntities((prev) => [newEntity, ...prev]);
        addEntity(newEntity);
        return newEntity;
    }

    async function eliminarEntidad(id) {
        await deleteFinancialEntity(id, token);
        setEntities((prev) => prev.filter((e) => e.id !== id));
    }

    return {
        entities,
        loading,
        crearEntidad,
        eliminarEntidad,
        setEntities,
    };
}
