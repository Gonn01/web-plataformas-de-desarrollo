// src/pages/entidades_financieras/hooks/use-entidades-ui.js

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEntidadesData } from './use-entidades-data';

export function useEntidadesUI() {
    const navigate = useNavigate();
    const { entities, loading, crearEntidad, eliminarEntidad } = useEntidadesData();

    const [query, setQuery] = useState('');
    const [openNew, setOpenNew] = useState(false);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return entities;

        return entities.filter((e) => (e.name || '').toLowerCase().includes(q));
    }, [query, entities]);

    // const showEmpty = entities.length === 0 && filtered.length === 0;
    const showEmpty = !loading && entities.length === 0 && filtered.length === 0;

    async function handleSaveNew({ name }) {
        try {
            await crearEntidad({ name });
            setOpenNew(false);
            navigate('/app/entidades');
        } catch (err) {
            console.error('Error creating entity:', err);
            alert('No se pudo crear la entidad.');
        }
    }

    async function handleDelete(entity) {
        try {
            await eliminarEntidad(entity.id);
        } catch (err) {
            console.error('Error deleting entity:', err);
            alert('No se pudo eliminar la entidad.');
        }
    }

    return {
        // UI
        query,
        setQuery,
        openNew,
        setOpenNew,
        filtered,
        showEmpty,
        loading,

        // acciones
        handleSaveNew,
        handleDelete,

        // navegación
        navigate,
    };
}
