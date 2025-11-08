// src/pages/EntidadDetalle.jsx
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { formatMoney } from '../utils/FormatMoney';
import NewExpenseModal from '../components/modals/NewExpenseCard';

const MOCK = {};

export default function EntidadDetalle() {
    const { id } = useParams();
    const [tab, setTab] = useState('activos');
    const [openNewExpense, setOpenNewExpense] = useState(false);

    const entity = useMemo(() => {
        if (MOCK[id]) return MOCK[id];
        return { name: 'Nueva Entidad', stats: { ars: 0, usd: 0, debts: 0 } };
    }, [id]);

    const activos = [];
    const finalizados = [
        {
            icon: 'shopping_bag',
            title: 'Electrodomésticos',
            subtitle: 'Cuotas finalizadas',
            due: '—',
            progress: 100,
        },
    ];
    const log = [
        { date: '12/09/2024', text: 'Editaste el nombre de la entidad.' },
        { date: '10/09/2024', text: 'Registraste pago de Tarjeta de Crédito (Cuota 8/9).' },
    ];

    return (
        <>
            {/* Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
                    {entity.name}
                </h1>
                <div className="flex items-center gap-2">
                    <button
                        className="flex h-10 min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary/20 px-4 text-sm font-bold text-primary hover:bg-primary/30"
                        onClick={() => setOpenNewExpense(true)}
                    >
                        <Icon name="add" className="text-base" />
                        <span className="truncate">Agregar Gasto</span>
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-end gap-2 rounded-lg bg-white/5 p-2">
                <button
                    aria-label="Editar entidad"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                    onClick={() => alert('Editar entidad')}
                >
                    <Icon name="edit" className="text-xl" />
                </button>
                <button
                    aria-label="Eliminar entidad"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-500/10"
                    onClick={() => confirm('¿Eliminar entidad?') && alert('Entidad eliminada')}
                >
                    <Icon name="delete" className="text-xl" />
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-1 flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        Balance Total (ARS)
                    </p>
                    <p
                        className={`text-2xl font-bold tracking-tight ${entity.stats.ars < 0 ? 'text-red-500' : 'text-green-500'}`}
                    >
                        {formatMoney(entity.stats.ars, 'ARS')}
                    </p>
                </div>
                <div className="flex flex-1 flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        Balance Total (USD)
                    </p>
                    <p
                        className={`text-2xl font-bold tracking-tight ${entity.stats.usd < 0 ? 'text-red-500' : 'text-green-500'}`}
                    >
                        {formatMoney(entity.stats.usd, 'USD')}
                    </p>
                </div>
                <div className="flex flex-1 flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Deudas Activas</p>
                    <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        {entity.stats.debts}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-col">
                <div className="border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex gap-4 sm:gap-6">
                        {['activos', 'finalizados', 'log'].map((t) => (
                            <button
                                key={t}
                                className={`pb-3 pt-2 text-sm ${tab === t
                                    ? 'text-primary font-bold border-b-2 border-b-primary'
                                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 border-b-2 border-b-transparent font-medium'
                                    }`}
                                onClick={() => setTab(t)}
                            >
                                {t === 'activos'
                                    ? 'Gastos Activos'
                                    : t === 'finalizados'
                                        ? 'Gastos Finalizados'
                                        : 'Log de Cambios'}
                            </button>
                        ))}
                    </div>
                </div>

                {tab === 'activos' && (
                    <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
                        {activos.length === 0 && (
                            <div className="text-sm text-zinc-500 dark:text-zinc-400 py-6">
                                Sin gastos activos.
                            </div>
                        )}
                    </div>
                )}

                {tab === 'finalizados' && (
                    <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
                        {finalizados.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 py-4 hover:bg-zinc-50 dark:hover:bg-white/5"
                            >
                                <div className="flex shrink-0 items-center justify-center rounded-lg bg-primary/20 size-10 text-primary">
                                    <Icon name={item.icon} />
                                </div>
                                <div className="flex flex-1 flex-col justify-center">
                                    <p className="font-medium text-zinc-900 dark:text-white">{item.title}</p>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.subtitle}</p>
                                </div>
                                <div className="hidden md:flex flex-col items-end gap-1 text-sm">
                                    <p className="font-medium text-zinc-900 dark:text-white">Vence: {item.due}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                                            <div
                                                className="h-full rounded-full bg-primary"
                                                style={{ width: `${item.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                            100%
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        aria-label="Más opciones"
                                        className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                                        onClick={() => alert('Más opciones')}
                                    >
                                        <Icon name="more_vert" className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'log' && (
                    <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
                        {log.map((l, i) => (
                            <div key={i} className="flex items-center justify-between py-3">
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">{l.text}</p>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">{l.date}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Modal */}
            {openNewExpense && (
                <NewExpenseModal
                    onClose={() => setOpenNewExpense(false)}
                    onSave={(payload) => {
                        console.log('Nuevo gasto:', payload);
                        setOpenNewExpense(false);
                    }}
                />
            )}
        </>
    );
}
