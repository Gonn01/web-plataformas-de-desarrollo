import { ChipTipoGasto } from '@/components/ChipTipoGasto';
import ProgressBar from '@/components/ProgressBar';
import CategoryBadges from '@/components/CategoryBadges';
import { formatMoney } from '@/utils/FormatMoney';

export default function ExpenseCard({ gasto, onClick, onPayClick, loading = false }) {
    const progress = gasto.fixed_expense
        ? 100
        : gasto.number_of_quotas > 0
            ? (gasto.payed_quotas / gasto.number_of_quotas) * 100
            : (gasto.progress ?? 0);

    const cur = gasto.currency_type;
    const paidTotal = (gasto.payed_quotas ?? 0) * (gasto.amount_per_quota ?? 0);

    return (
        <div
            className={`flex flex-col gap-2 rounded-lg p-3 transition-all cursor-pointer relative hover:bg-black/5 dark:hover:bg-white/5 ${loading ? 'pointer-events-none' : ''}`}
            onClick={onClick}
        >
            {loading && (
                <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-lg animate-pulse z-10" />
            )}

            {/* Top row */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                        {gasto.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5">
                        <ChipTipoGasto tipo={gasto.type} fijo={gasto.fixed_expense} />
                    </div>
                    <CategoryBadges categories={gasto.categories ?? []} />
                </div>

                {/* Amounts */}
                <div className="flex flex-col items-end gap-0.5 text-right shrink-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                        {formatMoney(gasto.amount_per_quota, cur)}
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">
                            / cuota
                        </span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {gasto.fixed_expense
                            ? `${gasto.payed_quotas} ${gasto.payed_quotas === 1 ? 'vez pagado' : 'veces pagado'}`
                            : `${gasto.payed_quotas}/${gasto.number_of_quotas} cuotas`}
                    </p>
                    {!gasto.fixed_expense && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                            {formatMoney(paidTotal, cur)} / {formatMoney(gasto.amount, cur)}
                        </p>
                    )}
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                        {cur}
                    </span>
                </div>
            </div>

            {/* Progress row */}
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <ProgressBar
                        progress={progress}
                        type={gasto.type}
                        fixed={gasto.fixed_expense}
                        quotas={gasto.number_of_quotas}
                    />
                </div>

                {!gasto.fixed_expense && (
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 w-9 text-right shrink-0">
                        {Math.round(progress)}%
                    </span>
                )}

                {onPayClick && (
                    <button
                        className="text-xs cursor-pointer font-bold leading-normal tracking-wide bg-primary/20 text-primary px-3 py-1.5 rounded-md hover:bg-primary/30 transition-colors flex items-center gap-2 shrink-0"
                        disabled={loading}
                        onClick={(e) => {
                            e.stopPropagation();
                            onPayClick(gasto);
                        }}
                    >
                        {loading ? (
                            <>
                                <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                Procesando…
                            </>
                        ) : gasto.type === 'INGRESO' ? (
                            'Registrar cobro'
                        ) : (
                            'Pagar cuota'
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
