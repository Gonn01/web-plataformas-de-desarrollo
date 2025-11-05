// src/pages/FinanceDashboard.jsx
import { useState } from 'react';
import Icon from '../components/Icon';
import Sidebar from '../components/Sidebar';
import StatCards from '../components/StatCards';
import CurrencyToggle from '../components/CurrencyToggle';
import ActiveExpenses from '../components/ActiveExpenses';
import Upcoming from '../components/Upcoming';

// 👇 importa el modal
import NewExpenseModal from './NewExpenseCard';

export default function FinanceDashboard() {
  const [currency, setCurrency] = useState('ARS');
  const [query, setQuery] = useState('');
  const [openNewExpense, setOpenNewExpense] = useState(false); // 👈 estado para el modal

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar />

        {/* Main */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex min-w-72 flex-col gap-2">
                <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                  Dashboard
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                  Un resumen de tus finanzas personales.
                </p>
              </div>
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                onClick={() => setOpenNewExpense(true)} // 👈 abre modal
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
                <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pt-4">
                  Resumen Mensual
                </h3>
                <CurrencyToggle currency={currency} onChange={setCurrency} />
              </div>

              {/* Middle big card */}
              <ActiveExpenses query={query} />

              {/* Right column */}
              <Upcoming />
            </div>

            {/* Campo de búsqueda controlado (oculto aquí) */}
            <div className="sr-only">
              <input value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
        </main>
      </div>

      {/* Modal de "Nuevo Gasto" */}
      {openNewExpense && (
        <NewExpenseModal
          onClose={() => setOpenNewExpense(false)}
          onSave={(payload) => {
            // Acá podés hacer el POST a tu API, guardar en estado global, etc.
            console.log('Nuevo gasto:', payload);
            setOpenNewExpense(false);
          }}
        />
      )}
    </div>
  );
}
