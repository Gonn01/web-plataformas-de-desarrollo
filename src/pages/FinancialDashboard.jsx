// src/pages/FinanceDashboard.jsx
import { useState } from 'react';
import Icon from '../components/Icon';
import StatCards from '../components/StatCards';
import CurrencyToggle from '../components/CurrencyToggle';
import ActiveExpenses from '../components/ActiveExpenses';
import Upcoming from '../components/Upcoming';
import NewExpenseModal from '../components/modals/NewExpenseCard';
import { agregarDeuda } from '../services/deudas'; //aca agregue para las deudas

export default function FinanceDashboard() {
    const [currency, setCurrency] = useState('ARS');
    const [query, setQuery] = useState('');
    const [openNewExpense, setOpenNewExpense] = useState(false);

    return (
        <>
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-72 flex-col gap-2">
                    <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                        Dashboard
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal">
                        Un resumen de tus finanzas personales.
                    </p>
                </div>
                <button
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-primary text-background-dark text-sm font-bold tracking-[0.015em] hover:bg-primary/90 transition-colors"
                    onClick={() => setOpenNewExpense(true)}
                >
                    <Icon name="add_circle" className="mr-2 text-lg" />
                    <span className="truncate">Crear Gasto / Deuda</span>
                </button>
            </div>
            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mt-8">
                {/* Left column */}
                <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
                    <StatCards />
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold pt-4">
                        Resumen Mensual
                    </h3>
                    <CurrencyToggle currency={currency} onChange={setCurrency} />
                </div>

                {/* Middle big card */}
                <ActiveExpenses query={query} />

                {/* Right column */}
                <Upcoming />
            </div>
            ...
            {/* Buscador oculto */}
            <div className="sr-only">
                <input value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            {/* Modal */}
            {openNewExpense && (
                <NewExpenseModal
                    onClose={() => setOpenNewExpense(false)}
                    onSave={(payload) => {
                        console.log('Nuevo gasto:', payload);

                        const titulo = payload.name?.trim() || 'Nuevo gasto / deuda';
                        const monto = Number.isFinite(Number(payload.amount))
                            ? Number(payload.amount)
                            : 0;

                        agregarDeuda({
                            titulo,
                            monto,
                            entidad: payload.entity?.trim() || '',
                            moneda: payload.currency || 'ARS',
                            tipo: payload.type,
                        });

                        setOpenNewExpense(false);
                    }}
                />
            )}
        </>
    );
}
