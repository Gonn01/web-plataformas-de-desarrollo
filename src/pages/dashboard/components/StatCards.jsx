import { formatMoney } from '../../../utils/FormatMoney';

export default function StatCards({ summary, currency = 'ARS' }) {
    if (!summary) return null;

    const {
        total_balance = 0,
        total_debo = 0,
        total_me_deben = 0,
    } = {
        total_balance: summary.total_balance ?? 0,
        total_debo: summary.total_debo ?? 0,
        total_me_deben: summary.total_me_deben ?? 0,
    };

    const cards = [
        {
            label: `Balance general (${currency})`,
            value: formatMoney(total_balance, currency),
            tone:
                total_balance >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-500 dark:text-red-400',
        },
        {
            label: `Total Debo (${currency})`,
            value: formatMoney(total_debo, currency),
            tone: 'text-red-500 dark:text-red-400',
        },
        {
            label: `Total Me deben (${currency})`,
            value: formatMoney(total_me_deben, currency),
            tone: 'text-emerald-600 dark:text-emerald-400',
        },
    ];

    return (
        <div className="flex flex-row gap-4 flex-wrap">
            {cards.map((c) => (
                <div
                    key={c.label}
                    className="flex min-w-[180px] flex-1 flex-col gap-2 rounded-xl p-4 border border-black/10 dark:border-white/10 bg-white dark:bg-white/5"
                >
                    <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal">
                        {c.label}
                    </p>
                    <p className={`${c.tone} tracking-tight text-2xl font-bold leading-tight`}>
                        {c.value}
                    </p>
                </div>
            ))}
        </div>
    );
}