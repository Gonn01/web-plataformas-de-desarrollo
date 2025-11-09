// src/pages/EntidadesFinancieras.jsx
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NewEntityModal from '../components/modals/NewEntityModal';
import EntityCard from '@/components/EntityCard';

// Mocks
const MOCK_ENTITIES = [
    {
        id: 'ent-bna',
        name: 'Banco Nación',
        type: 'bank',
        balances: [
            { currency: 'ARS', amount: -150000 },
            { currency: 'USD', amount: -200 },
        ],
        activeExpenses: 3,
    },
    {
        id: 'ent-galicia',
        name: 'Banco Galicia',
        type: 'bank',
        balances: [{ currency: 'ARS', amount: -25000 }],
        activeExpenses: 2,
    },
    {
        id: 'ent-juan',
        name: 'Juan Pérez',
        type: 'person',
        balances: [{ currency: 'ARS', amount: 75000 }],
        activeExpenses: 1,
    },
    {
        id: 'ent-inmo',
        name: 'Inmobiliaria G.',
        type: 'wallet',
        balances: [{ currency: 'ARS', amount: -40000 }],
        activeExpenses: 1,
    },
    {
        id: 'ent-efectivo',
        name: 'Efectivo',
        type: 'wallet',
        balances: [
            { currency: 'ARS', amount: 20000 },
            { currency: 'USD', amount: 50 },
        ],
        activeExpenses: 0,
    },
];

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
                    Crea tu primera entidad para empezar a organizar tus finanzas y llevar un
                    control de tus deudas y saldos.
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

export default function EntidadesFinancieras() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [entities, setEntities] = useState(MOCK_ENTITIES);
    const [openNew, setOpenNew] = useState(false);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return entities;
        return entities.filter((e) => e.name.toLowerCase().includes(q));
    }, [query, entities]);

    const openCreateModal = () => setOpenNew(true);

    const handleSaveNew = ({ name }) => {
        const newEntity = {
            id: crypto.randomUUID(),
            name,
            type: 'bank',
            balances: [{ currency: 'ARS', amount: 0 }],
            activeExpenses: 0,
        };
        setEntities((prev) => [newEntity, ...prev]);
        setOpenNew(false);
        navigate(`/entidades/${newEntity.id}`);
    };

    const handleOpen = (entity) => navigate(`/entidades/${entity.id}`);

    const showEmpty = filtered.length === 0 && entities.length === 0;

    return (
        <>
            {/* Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-slate-900 dark:text-white text-4xl font-black tracking-tighter">
                    Mis Entidades
                </h1>
                <button
                    onClick={openCreateModal}
                    className="flex min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold tracking-wide shadow-sm hover:opacity-90 transition-opacity"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    <span className="truncate">Nueva Entidad</span>
                </button>
            </div>

            {/* Search */}
            <div className="px-0 py-2">
                <label className="flex flex-col min-w-40 h-12 w-full">
                    <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
                        <div className="text-slate-400 dark:text-slate-500 flex bg-white dark:bg-slate-800/50 items-center justify-center pl-4 rounded-l-xl border-y border-l border-slate-200 dark:border-slate-700/80">
                            <span className="material-symbols-outlined text-2xl">search</span>
                        </div>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar entidad por nombre"
                            className="form-input flex w-full min-w-0 flex-1 overflow-hidden rounded-r-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-y border-r border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/50 h-full placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 text-base"
                        />
                    </div>
                </label>
            </div>

            {/* List */}
            <div className="flex flex-col gap-4">
                {filtered.map((e) => (
                    <EntityCard key={e.id} entity={e} onClick={handleOpen} />
                ))}

                {filtered.length === 0 && entities.length > 0 && (
                    <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
                        No se encontraron entidades para “{query}”.
                    </div>
                )}

                {showEmpty && <EmptyState onCreate={openCreateModal} />}
            </div>

            <NewEntityModal
                open={openNew}
                onClose={() => setOpenNew(false)}
                onSave={handleSaveNew}
            />
        </>
    );
}
