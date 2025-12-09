import Icon from '../../../components/Icon';
import ConfirmInstallmentPaymentModal from './modals/ConfirmPaymentModal/ConfirmPaymentModal';

import { useActiveExpensesFilter } from '../hooks/use-active-expenses-filter';
import { useActiveExpensesModal } from '../hooks/use-active-expenses-modal';
import { usePayments } from '../../../hooks/use-payments';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/use-auth';

import { useState } from 'react';
import { ChipTipoGasto } from '@/components/ChipTipoGasto';
import { currencyCodeToLabel } from '@/pages/Configuracion';

export default function ActiveExpenses({
    query,
    groups,
    currency,
    onCurrencyChange,
    onQueryChange,
    onPaid,
}) {
    const navigate = useNavigate();
    const filtered = useActiveExpensesFilter(groups, currency, query);
    const modal = useActiveExpensesModal();

    const { token } = useAuth();
    const { handleConfirm } = usePayments(token, onPaid);

    // Estado de carga por ID de gasto
    const [loadingIds, setLoadingIds] = useState(new Set());

    // Marca items en loading
    const markLoading = (items) => {
        const ids = items.map((i) => i.id);
        setLoadingIds((prev) => new Set([...prev, ...ids]));
    };

    // Limpia loading
    const clearLoading = () => setLoadingIds(new Set());

    return (
        <div className="lg:col-span-3 xl:col-span-3 h-[490px] flex flex-col gap-4 rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white dark:bg-white/5 mt-6">
            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2">
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                        Gastos Activos
                    </h3>

                    {/* Currency Toggle */}
                    <div className="flex flex-wrap gap-2">
                        {['ARS', 'USD', 'EUR'].map((cur) => (
                            <button
                                key={cur}
                                type="button"
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${currency === cur
                                    ? 'bg-primary text-black border-primary'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600'
                                    }`}
                                onClick={() => onCurrencyChange?.(cur)}
                            >
                                {cur}
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
            <div className="flex flex-col gap-2 overflow-y-auto pr-2">
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
                        <ul className="flex flex-col gap-3">
                            {group.items.map((it) => {
                                const isLoading = loadingIds.has(it.id);

                                return (
                                    <li
                                        key={it.id}
                                        className={`
                                            flex flex-col rounded-lg p-3 transition-all cursor-pointer relative
                                            hover:bg-black/5 dark:hover:bg-white/5
                                            ${isLoading ? 'pointer-events-none' : ''}
                                        `}
                                        onClick={() => navigate(`/app/gastos/${it.id}`)}
                                    >
                                        {/* LOADING OVERLAY */}
                                        {isLoading && (
                                            <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-lg animate-pulse z-10"></div>
                                        )}

                                        {/* Top row */}
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="gap-1.5 flex-1">
                                                <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-2">
                                                    {it.name}
                                                </p>

                                                <ChipTipoGasto
                                                    tipo={it.type}
                                                    fijo={it.fixed_expense}
                                                />
                                            </div>

                                            {/* RIGHT */}
                                            <div className="flex flex-col items-end gap-2 text-right">
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">
                                                    {`${currencyCodeToLabel(it.currency_type)} $${it.amount_per_quota.toFixed(2)}`}
                                                </p>

                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {it.number_of_quotas.total
                                                        ? `de ${currencyCodeToLabel(it.currency_type)} $${it.amount.toFixed(
                                                            2,
                                                        )} · ${it.number_of_quotas}/${it.number_of_quotas} cuotas`
                                                        : `Total ${currencyCodeToLabel(it.currency_type)} $${it.amount.toFixed(2)}`}
                                                </p>
                                            </div>
                                        </div>

                                        {/* PROGRESS BAR */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 flex-1 overflow-hidden">
                                                <div
                                                    className={`h-1.5 rounded-full transition-all duration-500
                                                         ${it.fixed_expense
                                                            ? 'bg-yellow-400'
                                                            : it.type === 'ME_DEBEN'
                                                                ? 'bg-green-500'
                                                                : 'bg-red-500'
                                                        }
                `}
                                                    style={{ width: `${it.progress}%` }}
                                                />
                                            </div>

                                            <button
                                                className="text-xs cursor-pointer font-bold leading-normal tracking-wide bg-primary/20 text-primary px-3 py-1.5 rounded-md hover:bg-primary/30 transition-colors flex items-center gap-2"
                                                disabled={isLoading}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    modal.openItem(group, it);
                                                }}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                        Procesando…
                                                    </>
                                                ) : it.type === 'ME_DEBEN' ? (
                                                    `Registrar cobro${!it.fixed_expense ? ` (${it.payed_quotas + 1}/${it.number_of_quotas})` : ''}`
                                                ) : (
                                                    `Pagar cuota${!it.fixed_expense ? ` (${it.payed_quotas + 1}/${it.number_of_quotas})` : ''}`
                                                )}
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
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
                    clearLoading();
                    modal.setModalOpen(false);
                }}
            />
        </div>
    );
}
