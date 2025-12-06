import { formatMoney } from '@/utils/FormatMoney';

export function GastoFinalizadoItem({ gasto, onClick }) {
    return (
        <div onClick={onClick} className="flex items-center justify-between py-4">
            <div>
                <p className="font-medium text-zinc-900 dark:text-white">{gasto.name}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Finalizado</p>
            </div>

            <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                {formatMoney(gasto.amount, gasto.currency_type === '1' ? 'ARS' : 'USD')}
            </p>
        </div>
    );
}
