import { formatMoney } from '@/utils/FormatMoney';

export default function ProgresoPago({ gasto, porcentaje, totalPagado }) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <p className="text-base font-medium">Progreso de Pago</p>
                {!gasto.fixed_expense && (
                    <span className="text-sm font-semibold text-primary">
                        {porcentaje.toFixed(0)}%
                    </span>
                )}
            </div>

            <div className="h-2 rounded-full bg-[#3d5245]">
                <div
                    className={`h-2 rounded-full ${gasto.fixed_expense ? 'bg-yellow-400' : gasto.type === 'INGRESO' ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${porcentaje}%` }}
                />
            </div>

            <p className="text-sm text-[#9eb7a8]">
                {gasto.fixed_expense
                    ? `Veces pagado ${gasto.payed_quotas}`
                    : `${gasto.payed_quotas} de ${gasto.number_of_quotas} cuotas pagadas (${formatMoney(totalPagado, gasto.currency_type)} / ${formatMoney(gasto.amount, gasto.currency_type)})`}
            </p>
        </div>
    );
}
