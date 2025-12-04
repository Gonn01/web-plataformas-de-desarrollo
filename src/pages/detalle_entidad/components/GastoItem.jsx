import { formatMoney } from '@/utils/FormatMoney';

export function GastoItem({ gasto, onClick }) {
    return (
        <div onClick={onClick} className="flex items-center justify-between py-4">
            <div>
                <p className="font-medium text-zinc-900 dark:text-white">{gasto.name}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Cuotas: {gasto.payed_quotas}/{gasto.number_of_quotas}
                </p>
            </div>

            <p className="font-semibold text-primary">
                {formatMoney(gasto.amount, gasto.currency_type === '1' ? 'ARS' : 'USD')}
            </p>
        </div>
    );
}
