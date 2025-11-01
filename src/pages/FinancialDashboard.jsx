// FinanceDashboard.jsx
// React + Tailwind version of the provided HTML
// Notes:
// 1) Add these to public/index.html <head> for fonts & icons:
//    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
//    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
// 2) In your CSS (e.g., index.css) set:
//    .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24 }
// 3) Tailwind: ensure darkMode: 'class' and content includes ./src/**/*.{js,jsx}

import { useMemo, useState } from 'react';

function Icon({ name, className = '' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

const USER = {
  name: 'Usuario',
  email: 'usuario@email.com',
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCSDowoyjRInQNwikV9qKbMW60Xq3jnMJ9TbOdVyNE-Xm55-YFry4euex2XYysEUFySgiTWm6jjREdlG8f2N1xKJKQBL1AjuRrm3mCQ_-GcFHb73jaHkbBBeQzIdG2RseylSxWz0tG1tVx-AiSDpndFbVafVTNqkWg1-gK_V0yJV_itzXwprBKHzqkotEt_GYxXTRRxljzi_GVp2_w5ZRwBuyEN3Wob-cayxH-Kg76bSeVdOqr7YFixX5Hv3GfOBKRv5NiWEQLDog0',
};

const CARDS = [
  { label: 'Balance General', value: 'ARS $85,000', tone: 'text-slate-900 dark:text-white' },
  { label: 'Total que Debo', value: 'ARS $15,000', tone: 'text-red-500 dark:text-red-400' },
  {
    label: 'Total que Me Deben',
    value: 'ARS $100,000',
    tone: 'text-green-500 dark:text-green-400',
  },
];

const GROUPS = [
  {
    title: 'Banco Nación',
    cta: 'Pagar Cuota a Todos',
    items: [
      {
        title: 'Cuota 3/12 - Notebook',
        chip: { text: 'Debo', tone: 'red' },
        amount: 'ARS $15.000',
        total: 'de $60.000',
        progressPct: 25,
        action: 'Pagar Cuota',
      },
    ],
  },
  {
    title: 'Personal',
    cta: 'Cobrar Cuota a Todos',
    items: [
      {
        title: 'Préstamo a Juan',
        chip: { text: 'Me deben', tone: 'green' },
        amount: 'ARS $75.000',
        total: 'de $100.000',
        progressPct: 75,
        action: 'Cobrar Cuota',
      },
    ],
  },
  {
    title: 'Inmobiliaria G.',
    cta: 'Pagar Cuota a Todos',
    items: [
      {
        title: 'Alquiler Dpto.',
        chip: { text: 'Debo', tone: 'red' },
        amount: 'ARS $40.000',
        total: 'de $40.000',
        progressPct: 100,
        action: 'Pagar Cuota',
      },
    ],
  },
  {
    title: 'Banco Galicia',
    cta: 'Pagar Cuota a Todos',
    items: [
      {
        title: 'Pago Tarjeta',
        chip: { text: 'Debo', tone: 'red' },
        amount: 'ARS $25.000',
        total: 'de $25.000',
        progressPct: 100,
        action: 'Pagar Cuota',
      },
    ],
  },
];

const UPCOMING = [
  { tone: 'yellow', title: 'Vence en 2 días', subtitle: 'Alquiler Dpto.', icon: 'calendar_month' },
  { tone: 'red', title: 'Vencido', subtitle: 'Factura de Internet', icon: 'warning' },
  { tone: 'blue', title: 'Vence en 15 días', subtitle: 'Seguro del Auto', icon: 'notifications' },
];

export default function FinanceDashboard() {
  const [currency, setCurrency] = useState('ARS');
  const [query, setQuery] = useState('');

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROUPS;
    return GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((it) => it.title.toLowerCase().includes(q)),
    })).filter((g) => g.items.length > 0);
  }, [query]);

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <aside className="flex w-64 flex-col border-r border-black/10 dark:border-white/10 p-4 bg-white/50 dark:bg-background-dark">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                aria-label="User profile picture"
                style={{ backgroundImage: `url(${USER.avatar})` }}
              />
              <div className="flex flex-col">
                <h1 className="text-slate-900 dark:text-white text-base font-medium leading-normal">
                  {USER.name}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
                  {USER.email}
                </p>
              </div>
            </div>
            <nav className="flex flex-col gap-2 mt-4">
              <a
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary"
                href="#"
              >
                <Icon name="dashboard" className="text-2xl" />
                <p className="text-sm font-medium leading-normal">Dashboard</p>
              </a>
              <a
                className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
                href="#"
              >
                <Icon name="arrow_upward" className="text-2xl text-red-500" />
                <p className="text-sm font-medium leading-normal">Debo</p>
              </a>
              <a
                className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
                href="#"
              >
                <Icon name="arrow_downward" className="text-2xl text-green-500" />
                <p className="text-sm font-medium leading-normal">Me Deben</p>
              </a>
              <a
                className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
                href="#"
              >
                <Icon name="history" className="text-2xl" />
                <p className="text-sm font-medium leading-normal">Historial</p>
              </a>
            </nav>
          </div>
          <div className="mt-auto flex flex-col gap-1">
            <a
              className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
              href="#"
            >
              <Icon name="settings" className="text-2xl" />
              <p className="text-sm font-medium leading-normal">Configuración</p>
            </a>
          </div>
        </aside>

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
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                <Icon name="add_circle" className="mr-2 text-lg" />
                <span className="truncate">Crear Gasto / Deuda</span>
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mt-8">
              {/* Left column */}
              <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  {CARDS.map((c) => (
                    <div
                      key={c.label}
                      className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-black/10 dark:border-white/10 bg-white dark:bg-white/5"
                    >
                      <p className="text-slate-600 dark:text-slate-300 text-base font-medium leading-normal">
                        {c.label}
                      </p>
                      <p className={`${c.tone} tracking-tight text-3xl font-bold leading-tight`}>
                        {c.value}
                      </p>
                    </div>
                  ))}
                </div>

                <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pt-4">
                  Resumen Mensual
                </h3>

                {/* Currency toggle */}
                <div className="flex">
                  <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 p-1">
                    {['ARS', 'USD'].map((cur) => (
                      <label
                        key={cur}
                        className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 has-checked:bg-white dark:has-checked:bg-background-dark has-checked:shadow-sm has-checked:text-slate-900 dark:has-checked:text-white text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal`}
                      >
                        <span className="truncate">{cur}</span>
                        <input
                          className="invisible w-0"
                          name="currency-switch"
                          type="radio"
                          value={cur}
                          checked={currency === cur}
                          onChange={() => setCurrency(cur)}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle big card */}
              <div className="lg:col-span-2 xl:col-span-2 flex flex-col gap-4 rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white dark:bg-white/5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                    Gastos Activos
                  </h3>
                  <div className="relative w-full sm:max-w-xs">
                    <Icon
                      name="search"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      className="w-full rounded-lg border border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-700 py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary/50 focus:ring-primary/50"
                      placeholder="Buscar gasto..."
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div
                  className="flex flex-col gap-4 overflow-y-auto pr-2"
                  style={{ maxHeight: 480 }}
                >
                  {filteredGroups.map((group) => (
                    <div key={group.title} className="flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-4 py-2 border-b border-black/10 dark:border-white/10">
                        <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                          {group.title}
                        </h4>
                        <button className="shrink-0 text-xs font-bold leading-normal tracking-wide text-primary hover:text-primary/80 transition-colors">
                          {group.cta}
                        </button>
                      </div>
                      <ul className="flex flex-col gap-3">
                        {group.items.map((it, idx) => (
                          <li
                            key={`${group.title}-${idx}`}
                            className="flex flex-col gap-3 rounded-lg p-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex flex-col gap-1.5 flex-1">
                                <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                                  {it.title}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                  {it.chip && (
                                    <span
                                      className={`inline-flex items-center rounded-md px-1.5 py-0.5 font-medium ${
                                        it.chip.tone === 'red'
                                          ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                                          : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                                      }`}
                                    >
                                      {it.chip.text}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2 text-right">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">
                                  {it.amount}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {it.total}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 flex-1">
                                <div
                                  className={`${it.chip?.tone === 'green' ? 'bg-green-500' : 'bg-red-500'} h-1.5 rounded-full`}
                                  style={{ width: `${it.progressPct}%` }}
                                />
                              </div>
                              <button className="text-xs font-bold leading-normal tracking-wide bg-primary/20 text-primary px-3 py-1.5 rounded-md hover:bg-primary/30 transition-colors">
                                {it.action}
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column */}
              <div className="lg:col-span-3 xl:col-span-1 flex flex-col gap-6">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                  Próximos Vencimientos
                </h3>
                <div className="flex flex-col gap-4">
                  {UPCOMING.map((u, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-4 rounded-xl p-4 border ${
                        u.tone === 'yellow'
                          ? 'bg-yellow-400/10 dark:bg-yellow-500/10 border-yellow-400/20 dark:border-yellow-500/20'
                          : u.tone === 'red'
                            ? 'bg-red-500/10 dark:bg-red-500/10 border-red-500/20'
                            : 'bg-blue-500/10 dark:bg-blue-500/10 border-blue-500/20'
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          u.tone === 'yellow'
                            ? 'bg-yellow-400/20 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-300'
                            : u.tone === 'red'
                              ? 'bg-red-500/20 text-red-600 dark:text-red-300'
                              : 'bg-blue-500/20 text-blue-600 dark:text-blue-300'
                        }`}
                      >
                        <Icon name={u.icon} />
                      </div>
                      <div>
                        <p
                          className={`${
                            u.tone === 'yellow'
                              ? 'text-yellow-800 dark:text-yellow-200'
                              : u.tone === 'red'
                                ? 'text-red-800 dark:text-red-200'
                                : 'text-blue-800 dark:text-blue-200'
                          } font-semibold`}
                        >
                          {u.title}
                        </p>
                        <p
                          className={`${
                            u.tone === 'yellow'
                              ? 'text-yellow-700 dark:text-yellow-300'
                              : u.tone === 'red'
                                ? 'text-red-700 dark:text-red-300'
                                : 'text-blue-700 dark:text-blue-300'
                          } text-sm`}
                        >
                          {u.subtitle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
