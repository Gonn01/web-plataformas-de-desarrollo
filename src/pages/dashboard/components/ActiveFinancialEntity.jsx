import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/Icon';
import ExpenseCard from '@/components/ExpenseCard';
import WhatsAppCopyButton from '@/pages/dashboard/components/WhatsAppCopyButton';
import GroupBalance from '@/pages/dashboard/components/GroupBalance';

export default function ActiveFinancialEntity({
    group,
    groups,
    currency,
    preferredCurrency,
    rates,
    loadingIds,
    onOpenGroup,
    onItemClick,
    onPayClick,
}) {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex flex-col gap-3">
            {/* Group Header */}
            <div className="flex items-center justify-between gap-4 py-2 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-2 min-w-0">
                    <button
                        type="button"
                        onClick={() => setCollapsed((prev) => !prev)}
                        className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        aria-label={collapsed ? 'Expandir grupo' : 'Colapsar grupo'}
                    >
                        <Icon
                            name={collapsed ? 'chevron_right' : 'expand_more'}
                            className="text-xl"
                        />
                    </button>

                    <div className="flex flex-col gap-0.5 min-w-0">
                        <h4
                            className="text-base font-semibold text-slate-800 dark:text-slate-100 cursor-pointer hover:underline truncate"
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
                        onClick={() => onOpenGroup?.(group)}
                        type="button"
                    >
                        Pagar/Registrar cobros
                    </button>
                </div>
            </div>

            {/* Items */}
            {!collapsed && (
                <ul className="flex flex-col gap-1">
                    {group.items.map((it) => (
                        <li key={it.id}>
                            <ExpenseCard
                                gasto={it}
                                loading={loadingIds?.has(it.id)}
                                onClick={() => onItemClick?.(it)}
                                onPayClick={() => onPayClick?.(group, it)}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
