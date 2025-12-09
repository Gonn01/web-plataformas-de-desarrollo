import { useState } from 'react';
import EntityCard from '@/pages/entidades_financieras/components/EntityCard';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal';

export default function EntitiesList({ filtered, query, navigate, onDelete, showEmpty }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const openDelete = (entity) => {
        setSelected(entity);
        setModalOpen(true);
    };

    const confirmDelete = () => {
        if (selected) onDelete(selected);
        setModalOpen(false);
        setSelected(null);
    };

    return (
        <>
            <div className="flex flex-col gap-4">
                {filtered.map((e) => (
                    <EntityCard
                        key={e.id}
                        entity={e}
                        onClick={() => navigate(`/app/entidades/${e.id}`)}
                        onDelete={openDelete}
                    />
                ))}

                {filtered.length === 0 && !showEmpty && (
                    <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
                        No se encontraron entidades para “{query}”.
                    </div>
                )}
            </div>

            {/* MODAL */}
            <ConfirmDeleteModal
                open={modalOpen}
                title="Eliminar entidad"
                message={`¿Seguro que querés eliminar "${selected?.name}"? Esta acción no se puede deshacer.`}
                confirmLabel="Eliminar entidad"
                onCancel={() => setModalOpen(false)}
                onConfirm={confirmDelete}
            />
        </>
    );
}
