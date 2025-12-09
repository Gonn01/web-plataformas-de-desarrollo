import { currencyCodeToLabel } from '@/pages/Configuracion';
import { formatMoney } from '@/utils/FormatMoney';

export default function MultiPaymentSection({ items }) {
    const totals = Array.from(
        items
            .reduce((map, it) => {
                const curr = it.currency_type;
                const amt = it.amount_per_quota || 0;
                map.set(curr, (map.get(curr) || 0) + amt);
                return map;
            }, new Map())
            .entries(),
    ).map(([currency, amount]) => ({ currency, amount }));

    return (
        <div className="flex flex-col gap-4 rounded-lg border bg-black/5 dark:bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">Gastos a afectar:</p>

            <ul className="flex flex-col gap-1 text-sm list-disc ml-4 text-white">
                {items.map((it) => (
                    <li key={it.id}>
                        {it.name}
                        <span className="ml-2 text-xs text-slate-500">
                            (
                            {formatMoney(
                                it.amount_per_quota,
                                currencyCodeToLabel(it.currency_type),
                            )}
                            )
                        </span>
                    </li>
                ))}
            </ul>

            <div className="border-t" />

            <p className="text-sm font-semibold text-white">Monto total a pagar:</p>

            <div className="flex flex-col gap-2">
                {totals.map((row) => (
                    <div key={row.currency} className="flex justify-between text-white">
                        <span className="text-xs">En {currencyCodeToLabel(row.currency)}</span>
                        <span className="text-lg font-bold">
                            {formatMoney(row.amount, currencyCodeToLabel(row.currency))}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
