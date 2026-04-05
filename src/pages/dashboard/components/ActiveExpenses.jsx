import Icon from '../../../components/Icon';
import ConfirmInstallmentPaymentModal from './modals/ConfirmPaymentModal/ConfirmPaymentModal';
import ExpenseCard from '@/components/ExpenseCard';

import { useActiveExpensesFilter } from '../hooks/use-active-expenses-filter';
import { useActiveExpensesModal } from '../hooks/use-active-expenses-modal';
import { usePayments } from '../../../hooks/use-payments';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/use-auth';

import { useState } from 'react';
import { Currency } from '@/utils/enums';

export default function ActiveExpenses({
    query,
    groups,
    updateAfterPayment,
    currency,
    onCurrencyChange,
    onQueryChange,
}) {
    const navigate = useNavigate();
    const filtered = useActiveExpensesFilter(groups, currency, query);
    const modal = useActiveExpensesModal();

    const countByCurrency = Object.values(Currency).reduce((acc, cur) => {
        acc[cur] = groups.reduce(
            (sum, g) => sum + g.items.filter((it) => it.currency_type === cur).length,
            0,
        );
        return acc;
    }, {});
    const totalCount = groups.reduce((sum, g) => sum + g.items.length, 0);

    const { token } = useAuth();
    const { handleConfirm } = usePayments(token);

    const [loadingIds, setLoadingIds] = useState(new Set());

    const markLoading = (items) => {
        const ids = items.map((i) => i.id);
        setLoadingIds((prev) => new Set([...prev, ...ids]));
    };

    const clearLoading = () => setLoadingIds(new Set());

    return (
        <div className="lg:col-span-3 xl:col-span-3 flex flex-col gap-4 rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white dark:bg-white/5 mt-6 min-h-0 flex-1">
            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2">
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                        Gastos Activos
                    </h3>

                    {/* Currency Toggle */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${currency === null
                                    ? 'bg-primary text-black border-primary'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600'
                                }`}
                            onClick={() => onCurrencyChange?.(null)}
                        >
                            Todos ({totalCount})
                        </button>
                        {Object.values(Currency).map((cur) => (
                            <button
                                key={cur}
                                type="button"
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${currency === cur
                                        ? 'bg-primary text-black border-primary'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600'
                                    }`}
                                onClick={() => onCurrencyChange?.(cur)}
                            >
                                {cur} ({countByCurrency[cur]})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search */}
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
                        onChange={(e) => onQueryChange?.(e.target.value)}
                    />
                </div>
            </div>

            {/* LIST */}
            <div className="flex flex-col gap-2 overflow-y-auto pr-2 flex-1 min-h-0">
                {filtered.map((group) => (
                    <div key={group.id} className="flex flex-col gap-3">
                        {/* Group Header */}
                        <div className="flex items-center justify-between gap-4 py-2 border-b border-black/10 dark:border-white/10">
                            <h4
                                className="text-base font-semibold text-slate-800 dark:text-slate-100 cursor-pointer hover:underline"
                                onClick={() => navigate(`/app/entidades/${group.id}`)}
                            >
                                {group.name}
                            </h4>

                            <button
                                className="shrink-0 text-xs cursor-pointer font-bold leading-normal tracking-wide text-primary hover:text-primary/80 transition-colors"
                                onClick={() => modal.openGroup(group)}
                                type="button"
                            >
                                Pagar/Registrar cobros
                            </button>
                        </div>

                        {/* Items */}
                        <ul className="flex flex-col gap-1">
                            {group.items.map((it) => (
                                <li key={it.id}>
                                    <ExpenseCard
                                        gasto={it}
                                        loading={loadingIds.has(it.id)}
                                        onClick={() => navigate(`/app/gastos/${it.id}`)}
                                        onPayClick={() => modal.openItem(group, it)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
                        No se encontraron gastos activos.
                    </div>
                )}
            </div>

            {/* MODAL */}
            <ConfirmInstallmentPaymentModal
                open={modal.modalOpen}
                entityName={modal.modalEntity}
                items={modal.modalItems}
                onCancel={() => modal.setModalOpen(false)}
                onConfirm={async () => {
                    modal.setModalOpen(false);
                    markLoading(modal.modalItems);

                    await handleConfirm(modal.modalItems);
                    updateAfterPayment(modal.modalItems);

                    clearLoading();
                    modal.setModalOpen(false);
                }}
            />
        </div>
    );
}
