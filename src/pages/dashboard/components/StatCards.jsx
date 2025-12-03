// src/pages/dashboard/components/StatCards.jsx
import BalancePill from './BalancePill';
import { formatMoney } from '../../../utils/FormatMoney';

const USD_RATE = 1000; 

function convertAmount(amount, currency) {
    const base = Number(amount || 0);
    if (currency === 'USD') {
        return base / USD_RATE;
    }
    return base;
}

export default function StatCards({ summary, currency = 'ARS' }) {
    // Loading skeleton
    if (!summary) {
        return (
            <div className="flex flex-col gap-4">
                <div className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                <div className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                <div className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            </div>
        );
    }

    const totalDeboARS = Number(summary.total_debo_ars || 0);
    const totalMeDebenARS = Number(summary.total_me_deben_ars || 0);
    const balanceARS =
        typeof summary.total_balance_ars === 'number'
            ? summary.total_balance_ars
            : totalMeDebenARS - totalDeboARS;

    const totalDebo = convertAmount(totalDeboARS, currency);
    const totalMeDeben = convertAmount(totalMeDebenARS, currency);
    const balance = convertAmount(balanceARS, currency);

    const cards = [
        {
            label: `Balance Neto (${currency})`,
            value: formatMoney(balance, currency),
            tone: balance >= 0 ? 'text-emerald-500' : 'text-red-500',
        },
        {
            label: `Total Debo (${currency})`,
            value: formatMoney(totalDebo, currency),
            tone: 'text-red-500',
        },
        {
            label: `Total Me Deben (${currency})`,
            value: formatMoney(totalMeDeben, currency),
            tone: 'text-emerald-500',
        },
    ];

    return (
        <div className="flex flex-col gap-4">
            {cards.map((c) => (
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

            {/* Pastillita de balance neto */}
            <BalancePill amount={balance} currency={currency} />
        </div>
    );
}
