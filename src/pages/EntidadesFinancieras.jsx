// src/pages/EntidadesFinancieras.jsx
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_ENTITIES = [];

function formatMoney(amount, currency) {
  const f = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });
  const sign = amount < 0 ? '-' : '';
  return `${sign}${f.format(Math.abs(amount))}`;
}

function EntityIcon({ type }) {
  const icon = type === 'bank' ? 'account_balance' : type === 'wallet' ? 'wallet' : 'person';
  return (
    <div className="text-primary flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-12">
      <span className="material-symbols-outlined text-3xl">{icon}</span>
    </div>
  );
}

function BalancePill({ amount, currency }) {
  const positive = amount >= 0;
  return (
    <p
      className={`${positive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'} text-sm font-medium leading-normal`}
    >
      {`Balance Neto ${currency}: ${formatMoney(amount, currency)}`}
    </p>
  );
}

function EntityCard({ entity, onClick }) {
  return (
    <button
      onClick={() => onClick?.(entity)}
      className="w-full text-left flex gap-4 bg-white dark:bg-slate-800/50 p-4 rounded-xl items-center justify-between shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:dark:bg-slate-800 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <EntityIcon type={entity.type} />
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-slate-900 dark:text-white text-base font-bold leading-normal">
            {entity.name}
          </p>
          <div className="flex flex-col sm:flex-row sm:gap-4">
            {entity.balances.map((b, i) => (
              <BalancePill key={i} amount={b.amount} currency={b.currency} />
            ))}
          </div>
          <p className="mt-1 text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">
            {entity.activeExpenses} gasto{entity.activeExpenses === 1 ? ' activo' : 's activos'}
          </p>
        </div>
      </div>
      <div className="shrink-0">
        <div className="text-slate-400 dark:text-slate-500 flex size-7 items-center justify-center">
          <span className="material-symbols-outlined text-2xl">chevron_right</span>
        </div>
      </div>
    </button>
  );
}

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
          Crea tu primera entidad para empezar a organizar tus finanzas y llevar un control de tus
          deudas y saldos.
        </p>
      </div>
      <button
        onClick={onCreate}
        className="flex min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-wide shadow-sm hover:opacity-90 transition-opacity"
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entities;
    return entities.filter((e) => e.name.toLowerCase().includes(q));
  }, [query, entities]);

  const handleAdd = () => {
    const newEntity = {
      id: crypto.randomUUID(),
      name: 'Nueva Entidad',
      type: 'bank',
      balances: [{ currency: 'ARS', amount: 0 }],
      activeExpenses: 0,
    };
    setEntities((prev) => [newEntity, ...prev]);
    navigate(`/entidades/${newEntity.id}`);
  };

  const handleOpen = (entity) => {
    navigate(`/entidades/${entity.id}`);
  };

  const showEmpty = filtered.length === 0 && entities.length === 0;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex flex-1 justify-center p-4 sm:p-6 md:p-8">
            <div className="layout-content-container flex w-full flex-col max-w-[960px] flex-1 gap-6">
              {/* Heading */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tighter">
                  Mis Entidades
                </h1>
                <button
                  onClick={handleAdd}
                  className="flex min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-wide shadow-sm hover:opacity-90 transition-opacity"
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
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-y border-r border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/50 h-full placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 text-base font-normal leading-normal"
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

                {showEmpty && <EmptyState onCreate={handleAdd} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
