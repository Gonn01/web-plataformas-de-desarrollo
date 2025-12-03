import { formatMoney } from '../../../utils/FormatMoney';

export default function StatCards({ summary, currency = 'ARS', usdRate }) {
    if (!summary) return null;

    const {
        total_balance_ars = 0,
        total_debo_ars = 0,
        total_me_deben_ars = 0,
    } = summary;

    const convert = (value) => {
        if (currency === 'ARS') return value;
        if (!usdRate) return 0; // si todavía no cargó la cotización, evita NaN
        return value / usdRate;
    };

    const balance = convert(total_balance_ars);
    const debo = convert(total_debo_ars);
    const meDeben = convert(total_me_deben_ars);

    const cards = [
        {
            label: `Balance general (${currency})`,
            value: formatMoney(balance, currency),
            tone:
                balance >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-500 dark:text-red-400',
        },
        {
            label: `Total Debo (${currency})`,
            value: formatMoney(debo, currency),
            tone: 'text-red-500 dark:text-red-400',
        },
        {
            label: `Total Me deben (${currency})`,
            value: formatMoney(meDeben, currency),
            tone: 'text-emerald-600 dark:text-emerald-400',
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
        </div>
    );
}