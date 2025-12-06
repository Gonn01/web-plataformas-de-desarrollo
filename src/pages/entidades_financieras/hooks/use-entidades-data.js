// src/pages/entidades_financieras/hooks/use-entidades-data.js

import { useEffect, useState } from 'react';
import { fetchFinancialEntities, createEntity, deleteFinancialEntity } from '@/services/api';
import useAuth from '@/hooks/use-auth';

export function useEntidadesData() {
    const { token } = useAuth();
    const [entities, setEntities] = useState([]);

    useEffect(() => {
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

    async function crearEntidad({ name }) {
        const newEntity = await createEntity({ name }, token);
        setEntities((prev) => [newEntity, ...prev]);
        return newEntity;
    }

    async function eliminarEntidad(id) {
        await deleteFinancialEntity(id, token);
        setEntities((prev) => prev.filter((e) => e.id !== id));
    }

    return {
        entities,
        crearEntidad,
        eliminarEntidad,
        setEntities,
    };
}
