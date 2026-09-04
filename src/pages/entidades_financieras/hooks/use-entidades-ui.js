import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEntidadesData } from './use-entidades-data';
import { useUIStore } from '@/store/use-ui-store';

export function useEntidadesUI() {
    const navigate = useNavigate();
    const { entities, loading, crearEntidad, eliminarEntidad, restaurarEntidad } = useEntidadesData();

    const [query, setQuery] = useState('');
    const [openNew, setOpenNew] = useState(false);
    const [showDeletedModal, setShowDeletedModal] = useState(false);
    const viewMode = useUIStore((s) => s.entitiesViewMode);
    const setViewMode = useUIStore((s) => s.setEntitiesViewMode);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const result = q
            ? entities.filter((e) => (e.name || '').toLowerCase().includes(q))
            : [...entities];

        return result.sort((a, b) => (b.activeExpenses ?? 0) - (a.activeExpenses ?? 0));
    }, [query, entities]);

    // const showEmpty = entities.length === 0 && filtered.length === 0;
    const showEmpty = !loading && entities.length === 0 && filtered.length === 0;

    async function handleSaveNew({ name, email }) {
        try {
            const { linkError } = await crearEntidad({ name, email });
            setOpenNew(false);
            navigate('/app/entidades');

            if (linkError) {
                console.error('Error vinculando usuario:', linkError);
                alert(
                    linkError?.response?.data?.error
                        ? `La entidad se creó, pero no se pudo vincular el usuario: ${linkError.response.data.error}`
                        : 'La entidad se creó, pero no se pudo vincular el usuario. Revisá el email.',
                );
            }
        } catch (err) {
            console.error('Error creating entity:', err);
            alert(err?.response?.data?.error || 'No se pudo crear la entidad.');
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
        query,
        setQuery,
        openNew,
        setOpenNew,
        showDeletedModal,
        setShowDeletedModal,
        viewMode,
        setViewMode,
        filtered,
        showEmpty,
        loading,

        handleSaveNew,
        handleDelete,
        restaurarEntidad,

        navigate,
    };
}
