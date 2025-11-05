// src/pages/EntidadDetalle.jsx
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Icon from '../components/Icon';


const MOCK = {
    
};

const fmt = (n, currency) => {
  const f = new Intl.NumberFormat('es-AR', { style: 'currency', currency, minimumFractionDigits: 2 });
  const sign = n < 0 ? '-' : '';
  return `${sign}${f.format(Math.abs(n))}`;
};

export default function EntidadDetalle() {
  const { id } = useParams();
  const [tab, setTab] = useState('activos'); // 'activos' | 'finalizados' | 'log'

  
  const entity = useMemo(() => {
    if (MOCK[id]) return MOCK[id];
    // fallback genérico (ejemplo)
    return {
      name: 'Nueva Entidad',
      stats: { ars: 0, usd: 0, debts: 0 },
    };
  }, [id]);

  
  const activos = [
   
  ];

  const finalizados = [
    { icon: 'shopping_bag', title: 'Electrodomésticos', subtitle: 'Cuotas finalizadas', due: '—', progress: 100 },
  ];

  const log = [
    { date: '12/09/2024', text: 'Editaste el nombre de la entidad.' },
    { date: '10/09/2024', text: 'Registraste pago de Tarjeta de Crédito (Cuota 8/9).' },
  ];

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex min-h-screen w-full">
        {/* Sidebar para mantener tu layout */}
        <Sidebar />

        {/* Main */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-4xl flex flex-col gap-6">
            {/* Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white sm:text-4xl">
                {entity.name}
              </h1>
              <div className="flex items-center gap-2">
                <button
                  className="flex h-10 min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary/20 px-4 text-sm font-bold text-primary transition-colors hover:bg-primary/30"
                  onClick={() => alert('Abrir modal para “Agregar Gasto”')}
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
                className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                onClick={() => alert('Editar entidad')}
              >
                <Icon name="edit" className="text-xl" />
              </button>
              <button
                aria-label="Eliminar entidad"
                className="flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-500/10"
                onClick={() => confirm('¿Eliminar entidad?') && alert('Entidad eliminada')}
              >
                <Icon name="delete" className="text-xl" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-1 flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Balance Total (ARS)</p>
                <p className={`text-2xl font-bold tracking-tight ${entity.stats.ars < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {fmt(entity.stats.ars, 'ARS')}
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Balance Total (USD)</p>
                <p className={`text-2xl font-bold tracking-tight ${entity.stats.usd < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {fmt(entity.stats.usd, 'USD')}
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Deudas Activas</p>
                <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{entity.stats.debts}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-col">
              <div className="border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex gap-4 sm:gap-6">
                  <button
                    className={`pb-3 pt-2 text-sm font-bold ${
                      tab === 'activos'
                        ? 'text-primary border-b-2 border-b-primary'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 border-b-2 border-b-transparent font-medium'
                    }`}
                    onClick={() => setTab('activos')}
                  >
                    Gastos Activos
                  </button>
                  <button
                    className={`pb-3 pt-2 text-sm ${
                      tab === 'finalizados'
                        ? 'text-primary font-bold border-b-2 border-b-primary'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 border-b-2 border-b-transparent font-medium'
                    }`}
                    onClick={() => setTab('finalizados')}
                  >
                    Gastos Finalizados
                  </button>
                  <button
                    className={`pb-3 pt-2 text-sm ${
                      tab === 'log'
                        ? 'text-primary font-bold border-b-2 border-b-primary'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 border-b-2 border-b-transparent font-medium'
                    }`}
                    onClick={() => setTab('log')}
                  >
                    Log de Cambios
                  </button>
                </div>
              </div>

              {/* Listas según tab */}
              {tab === 'activos' && (
                <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
                  {activos.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-white/5"
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
                            <div className="h-full rounded-full bg-primary" style={{ width: `${item.progress}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            {Math.round(item.progress)}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.status && (
                          <span
                            className={`hidden sm:inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              item.status.tone === 'green'
                                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                : item.status.tone === 'yellow'
                                ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                : 'bg-red-500/10 text-red-600 dark:text-red-400'
                            }`}
                          >
                            {item.status.label}
                          </span>
                        )}
                        <button
                          aria-label="Más opciones"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                          onClick={() => alert('Más opciones')}
                        >
                          <Icon name="more_vert" className="text-xl" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'finalizados' && (
                <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
                  {finalizados.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-white/5">
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
                            <div className="h-full rounded-full bg-primary" style={{ width: `${item.progress}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">100%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          aria-label="Más opciones"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
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
          </div>
        </main>
      </div>
    </div>
  );
}
