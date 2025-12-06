import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFinancialEntities, createEntity, deleteFinancialEntity } from '@/services/api';
import useAuth from '@/hooks/use-auth';

export function useEntidadesFinancieras() {
    const navigate = useNavigate();
    const auth = useAuth();

    const [query, setQuery] = useState('');
    const [entities, setEntities] = useState([]);
    const [openNew, setOpenNew] = useState(false);

    // ============================================================
    // 🚀 Cargar entidades reales
    // ============================================================
    useEffect(() => {
        if (!auth?.token) return;

        const loadEntities = async () => {
            try {
                const data = await fetchFinancialEntities(auth.token);

                // Normalización mínima para que EntityCard no falle
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

        loadEntities();
    }, [auth?.token]);

    // ============================================================
    // 🔍 Filtrar entidades
    // ============================================================
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return entities;

        return entities.filter((e) => (e.name || '').toLowerCase().includes(q));
    }, [query, entities]);

    const showEmpty = entities.length === 0 && filtered.length === 0;

    // ============================================================
    // ➕ Crear entidad real
    // ============================================================
    const handleSaveNew = async ({ name }) => {
        try {
            const newEntity = await createEntity({ name }, auth.token);

            setEntities((prev) => [newEntity, ...prev]);
            setOpenNew(false);

            navigate(`/app/entidades/${newEntity.id}`);
        } catch (err) {
            console.error('Error creating entity:', err);
            alert('No se pudo crear la entidad.');
        }
    };

    // ============================================================
    // 🗑 Eliminar entidad real
    // ============================================================
    const handleDelete = async (entity) => {
        try {
            await deleteFinancialEntity(entity.id, auth.token);

            setEntities((prev) => prev.filter((e) => e.id !== entity.id));
        } catch (err) {
            console.error('Error deleting entity:', err);
            alert('No se pudo eliminar la entidad.');
        }
    };

    return {
        query,
        setQuery,
        filtered,
        entities,
        openNew,
        setOpenNew,
        handleSaveNew,
        handleDelete,
        showEmpty,
        navigate,
    };
}
