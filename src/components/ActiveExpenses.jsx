import Icon from './Icon';
import { GROUPS } from '../data/constants';
import { useMemo } from 'react';

export default function ActiveExpenses({ query }) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROUPS;
    return GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((it) => it.title.toLowerCase().includes(q)),
    })).filter((g) => g.items.length > 0);
  }, [query]);

  return (
    <div className="lg:col-span-2 xl:col-span-2 flex flex-col gap-4 rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white dark:bg-white/5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
          Gastos Activos
        </h3>
        <div className="relative w-full sm:max-w-xs">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-lg border border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-700 py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary/50 focus:ring-primary/50"
            placeholder="Buscar gasto..."
            type="text"
            value={query}
            onChange={() => {
              /* controlado desde el padre */
            }}
            readOnly
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pr-2" style={{ maxHeight: 480 }}>
        {filtered.map((group) => (
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
                            className={`inline-flex items-center rounded-md px-1.5 py-0.5 font-medium ${it.chip.tone === 'red' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'}`}
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
                      <p className="text-xs text-slate-500 dark:text-slate-400">{it.total}</p>
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
  );
}
