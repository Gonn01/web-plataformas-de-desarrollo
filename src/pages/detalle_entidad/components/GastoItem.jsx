import { ChipTipoGasto } from '@/components/ChipTipoGasto';
import { formatDate } from '@/utils/FormatDate';
import { formatMoney } from '@/utils/FormatMoney';

export default function GastoItem({ gasto, variant = 'activo', onClick }) {
    let subtitle = '';

    switch (variant) {
        case 'activo':
            subtitle = gasto.fixed_expense
                ? `Veces pagado ${gasto.payed_quotas}`
                : `Cuotas: ${gasto.payed_quotas}/${gasto.number_of_quotas}`;
            break;

        case 'finalizado':
            subtitle = 'Finalizado';
            break;

        default:
            subtitle = '';
    }

    const currency =
        gasto.currency_type === '0' ? 'ARS' : gasto.currency_type === '1' ? 'USD' : 'EUR';

    return (
        <div
            onClick={onClick}
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-lg px-2 transition-colors"
        >
            <div className="flex items-center gap-3">
                <ChipTipoGasto
                    fijo={gasto.fixed_expense}
                    tipo={gasto.type}
                    column={true}
                ></ChipTipoGasto>
                <div>
                    <p className="font-medium text-zinc-900 dark:text-white">{gasto.name}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
                </div>
            </div>

            <p className="font-semibold text-primary">
                {variant == 'finalizado'
                    ? formatDate(gasto.finalization_date)
                    : formatMoney(gasto.amount, currency)}
            </p>
        </div>
    );
}
