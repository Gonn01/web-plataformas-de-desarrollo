import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFinancialEntities, createEntity } from '@/services/api';
import useAuth from '@/hooks/use-auth';

export function useEntidadesFinancieras() {
    const navigate = useNavigate();
    const auth = useAuth();

    const [query, setQuery] = useState('');
    const [entities, setEntities] = useState([]);
    const [openNew, setOpenNew] = useState(false);

    // ============================
    // 🚀 Cargar entidades REALES
    // ============================
    useEffect(() => {
        if (!auth?.token) return;

        const loadEntities = async () => {
            try {
                const data = await fetchFinancialEntities(auth.token);

                const normalized = data.map((e) => ({
                    ...e,
                    balances: [{ currency: 'ARS', amount: 0 }],
                    activeExpenses: 0,
                    type: 'bank',
                }));

                setEntities(normalized);
            } catch (err) {
                console.error('Error fetching entities:', err);
            }
        };

        loadEntities();
    }, [auth?.token]);

    // ============================
    // 🔍 Filtrar entidades
    // ============================
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return entities;
        return entities.filter((e) => e.name.toLowerCase().includes(q));
    }, [query, entities]);

    // ============================
    // ➕ Crear entidad REAL
    // ============================
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

    const showEmpty = filtered.length === 0 && entities.length === 0;
    const handleDelete = async (entity) => {
        try {
            // Aquí deberías llamar a la API para eliminar la entidad real
            // await deleteEntity(entity.id, auth.token);
            setEntities((prev) => prev.filter((e) => e.id !== entity.id));
        } catch (err) {
            console.error('Error deleting entity:', err);
            alert('No se pudo eliminar la entidad.');
        }
    };
    return {
        query,
        setQuery,
        entities,
        filtered,
        openNew,
        setOpenNew,
        handleSaveNew,
        showEmpty,
        navigate,
        handleDelete,
    };
}
