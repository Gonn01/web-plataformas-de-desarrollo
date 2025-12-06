import { formatDate } from '@/utils/FormatDate';
import { formatMoney } from '@/utils/FormatMoney';

export default function GastoItem({ gasto, variant = 'activo', onClick }) {
    let subtitle = '';

    switch (variant) {
        case 'activo':
            subtitle = `Cuotas: ${gasto.payed_quotas}/${gasto.number_of_quotas}`;
            break;

        case 'finalizado':
            subtitle = 'Finalizado';
            break;

        case 'fijo':
            subtitle = `Veces pagado: ${gasto.payed_quotas}`;
            break;

        default:
            subtitle = '';
    }

    const currency = gasto.currency_type === '1' ? 'ARS' : 'USD';
    console.log(gasto);
    return (
        <div
            onClick={onClick}
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-lg px-2 transition-colors"
        >
            <div>
                <p className="font-medium text-zinc-900 dark:text-white">{gasto.name}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
            </div>

            <p className="font-semibold text-primary">
                {variant == 'finalizado'
                    ? formatDate(gasto.finalization_date)
                    : formatMoney(gasto.amount, currency)}
            </p>
        </div>
    );
}
