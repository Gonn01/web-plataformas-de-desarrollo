// src/pages/EntidadesFinancieras.jsx

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Modal para crear entidad
import NewEntityModal from './dashboard/components/modals/NewEntityModal';

// 💳 Card visual que muestra la entidad (el correcto)
import EntityCard from '@/pages/detalle_entidad/components/EntityCard';

// Servicios reales
import { fetchFinancialEntities, createEntity, deleteFinancialEntity } from '@/services/api';

import useAuth from '@/hooks/use-auth';

//
// 💡 Componente vacío
//
function EmptyState({ onCreate }) {
    return (
        <div className="flex flex-col items-center justify-center gap-6 text-center bg-white dark:bg-slate-800/50 p-8 sm:p-12 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 mt-8">
            <div className="text-primary flex items-center justify-center rounded-full bg-primary/20 shrink-0 size-16">
                <span className="material-symbols-outlined text-4xl">add_card</span>
            </div>
            <div className="flex flex-col gap-2">
                <h2 className="text-slate-900 dark:text-white text-xl font-bold">
                    Aún no tienes entidades creadas
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    Crea tu primera entidad para empezar a organizar tus finanzas...
                </p>
            </div>
            <button
                onClick={onCreate}
                className="flex min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold tracking-wide shadow-sm hover:opacity-90 transition-opacity"
            >
                <span className="material-symbols-outlined text-lg">add</span>
                <span className="truncate">Crear Primera Entidad</span>
            </button>
        </div>
    );
}

//
// ============================================================
//              COMPONENTE PRINCIPAL DE ENTIDADES
// ============================================================
//
export default function EntidadesFinancieras() {
    const navigate = useNavigate();
    const auth = useAuth();

    const [query, setQuery] = useState('');
    const [entities, setEntities] = useState([]);
    const [openNew, setOpenNew] = useState(false);

    // ============================================================
    // 🚀 Cargar entidades desde API
    // ============================================================
    useEffect(() => {
        if (!auth?.token) return;

        const loadEntities = async () => {
            try {
                const data = await fetchFinancialEntities(auth.token);

                // Normalizo para evitar errores en EntityCard
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

    // ============================================================
    // 🔍 Filtro de búsqueda
    // ============================================================
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return entities;
        return entities.filter((e) => e.name.toLowerCase().includes(q));
    }, [query, entities]);

    // ============================================================
    // ➕ Crear nueva entidad
    // ============================================================
    const handleSaveNew = async ({ name }) => {
        try {
            const newEntity = await createEntity({ name }, auth.token);

            setEntities((prev) => [newEntity, ...prev]);
            setOpenNew(false);

            navigate(`/app/entidades/${newEntity.id}`);

        } catch (err) {
            console.error('Error creando entidad', err);
            alert('No se pudo crear la entidad.');
        }
    };

    // ============================================================
    // 🗑 Eliminar entidad
    // ============================================================
    const handleDelete = async (id, name) => {
        const confirmDelete = window.confirm(
            `¿Seguro que deseas eliminar la entidad "${name}"? Esta acción no se puede deshacer.`,
        );

        if (!confirmDelete) return;

        try {
            await deleteFinancialEntity(id, auth.token);

            setEntities((prev) => prev.filter((e) => e.id !== id));
        } catch (err) {
            console.error('Error eliminando entidad:', err);
        }
    };

    const showEmpty = filtered.length === 0 && entities.length === 0;

    // ============================================================
    //                RENDER PRINCIPAL
    // ============================================================
    return (
        <>
            {/* Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-slate-900 dark:text-white text-4xl font-black tracking-tighter">
                    Mis Entidades
                </h1>

                <button
                    onClick={() => setOpenNew(true)}
                    className="flex min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold tracking-wide shadow-sm hover:opacity-90 transition-opacity"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    <span className="truncate">Nueva Entidad</span>
                </button>
            </div>

            {/* Search */}
            <div className="px-0 py-2">
                <label className="flex flex-col min-w-40 h-12 w-full">
                    <div className="flex w-full items-center rounded-xl shadow-sm border dark:border-slate-700 bg-white dark:bg-slate-800/50">
                        <div className="text-slate-400 dark:text-slate-500 flex items-center justify-center pl-4">
                            <span className="material-symbols-outlined text-2xl">search</span>
                        </div>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar entidad por nombre"
                            className="form-input flex w-full rounded-r-xl text-slate-900 dark:text-white bg-transparent px-4"
                        />
                    </div>
                </label>
            </div>

            {/* LISTADO */}
            <div className="flex flex-col gap-4">
                {filtered.map((e) => (
                    <EntityCard
                        key={e.id}
                        entity={e}
                        onClick={() => navigate(`/app/entidades/${e.id}`)}
                        onDelete={() => handleDelete(e.id, e.name)}
                    />
                ))}

                {/* Sin resultados */}
                {filtered.length === 0 && entities.length > 0 && (
                    <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
                        No se encontraron entidades para “{query}”.
                    </div>
                )}

                {/* Lista vacía */}
                {showEmpty && <EmptyState onCreate={() => setOpenNew(true)} />}
            </div>

            {/* Modal nueva entidad */}
            <NewEntityModal
                open={openNew}
                onClose={() => setOpenNew(false)}
                onSave={handleSaveNew}
            />
        </>
    );
}
