import { formatMoney } from '@/utils/FormatMoney';

export function StatCard({ label, value, currency = 'ARS' }) {
    const safeCurrency = currency || 'ARS';

    return (
        <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</p>

            <p
                className={`text-2xl font-bold tracking-tight ${
                    value < 0 ? 'text-red-500' : 'text-green-500'
                }`}
            >
                {formatMoney(value, safeCurrency)}
            </p>
        </div>
    );
}
