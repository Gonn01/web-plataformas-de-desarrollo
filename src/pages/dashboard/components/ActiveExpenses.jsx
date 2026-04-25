import Icon from '../../../components/Icon';
import ConfirmInstallmentPaymentModal from './modals/ConfirmPaymentModal/ConfirmPaymentModal';
import ExpenseCard from '@/components/ExpenseCard';

import { useActiveExpensesFilter } from '../hooks/use-active-expenses-filter';
import { useActiveExpensesModal } from '../hooks/use-active-expenses-modal';
import { usePayments } from '../../../hooks/use-payments';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/use-auth';
import WhatsAppCopyButton from '@/pages/dashboard/components/WhatsAppCopyButton';
import GroupBalance from '@/pages/dashboard/components/GroupBalance';

import { useState } from 'react';
import { Currency } from '@/utils/enums';

export default function ActiveExpenses({
    query,
    groups,
    updateAfterPayment,
    currency,
    onCurrencyChange,
    onQueryChange,
    preferredCurrency,
    rates,
}) {
    const navigate = useNavigate();
    const [typeFilter, setTypeFilter] = useState(null);
    const [fixedFilter, setFixedFilter] = useState(null);
    const filtered = useActiveExpensesFilter(groups, currency, query, typeFilter, fixedFilter);
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
        <div className="lg:col-span-3 xl:col-span-3 flex flex-col gap-4 rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white dark:bg-white/5 min-h-0 flex-1">
            {/* HEADER */}
            <div className="flex items-center justify-between gap-4">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] shrink-0">
                    Gastos Activos
                </h3>
                <div className="relative w-full max-w-xs">
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

            {/* FILTERS */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2 border-y border-black/10 dark:border-white/10">
                <FilterGroup label="Moneda">
                    <ToggleButton active={currency === null} onClick={() => onCurrencyChange?.(null)}>
                        Todos ({totalCount})
                    </ToggleButton>
                    {Object.values(Currency).map((cur) => (
                        <ToggleButton
                            key={cur}
                            active={currency === cur}
                            onClick={() => onCurrencyChange?.(cur)}
                        >
                            {cur} ({countByCurrency[cur]})
                        </ToggleButton>
                    ))}
                </FilterGroup>

                <div className="w-px h-5 bg-black/10 dark:bg-white/10 shrink-0" />

                <FilterGroup label="Tipo">
                    {[
                        { value: null, label: 'Todos' },
                        { value: 'EGRESO', label: 'Egreso' },
                        { value: 'INGRESO', label: 'Ingreso' },
                    ].map(({ value, label }) => (
                        <ToggleButton
                            key={label}
                            active={typeFilter === value}
                            onClick={() => setTypeFilter(value)}
                        >
                            {label}
                        </ToggleButton>
                    ))}
                </FilterGroup>

                <div className="w-px h-5 bg-black/10 dark:bg-white/10 shrink-0" />

                <FilterGroup label="Frecuencia">
                    {[
                        { value: null, label: 'Todos' },
                        { value: true, label: 'Fijos' },
                        { value: false, label: 'Variables' },
                    ].map(({ value, label }) => (
                        <ToggleButton
                            key={label}
                            active={fixedFilter === value}
                            onClick={() => setFixedFilter(value)}
                        >
                            {label}
                        </ToggleButton>
                    ))}
                </FilterGroup>
            </div>

            {/* LIST */}
            <div className="flex flex-col gap-2 overflow-y-auto pr-2 flex-1 min-h-0">
                {filtered.map((group) => (
                    <div key={group.id} className="flex flex-col gap-3">
                        {/* Group Header */}
                        <div className="flex items-center justify-between gap-4 py-2 border-b border-black/10 dark:border-white/10">
                            <div className="flex flex-col gap-0.5">
                                <h4
                                    className="text-base font-semibold text-slate-800 dark:text-slate-100 cursor-pointer hover:underline"
                                    onClick={() => navigate(`/app/entidades/${group.id}`)}
                                >
                                    {group.name}
                                </h4>
                                <GroupBalance
                                    items={group.items}
                                    preferredCurrency={preferredCurrency}
                                    rates={rates}
                                />
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <WhatsAppCopyButton
                                    group={groups.find((g) => g.id === group.id) ?? group}
                                    selectedCurrency={currency}
                                    preferredCurrency={preferredCurrency}
                                    rates={rates}
                                />
                                <button
                                    className="text-xs cursor-pointer font-bold leading-normal tracking-wide text-primary hover:text-primary/80 transition-colors"
                                    onClick={() => modal.openGroup(group)}
                                    type="button"
                                >
                                    Pagar/Registrar cobros
                                </button>
                            </div>
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

function FilterGroup({ label, children }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 shrink-0">
                {label}
            </span>
            <div className="flex gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-white/5">
                {children}
            </div>
        </div>
    );
}

function ToggleButton({ active, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                active
                    ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
        >
            {children}
        </button>
    );
}
