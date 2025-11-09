// src/components/entities/EntityCard.jsx
import EntityIcon from './EntityIcon';
import BalancePill from './BalancePill';

export default function EntityCard({ entity, onClick }) {
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
                        {entity.balances.map((b) => (
                            <BalancePill
                                key={`${entity.id}-${b.currency}`}
                                amount={b.amount}
                                currency={b.currency}
                            />
                        ))}
                    </div>
                    <p className="mt-1 text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">
                        {entity.activeExpenses} gasto
                        {entity.activeExpenses === 1 ? ' activo' : 's activos'}
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
