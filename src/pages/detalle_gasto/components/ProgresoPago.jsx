export default function ProgresoPago({ gasto, porcentaje, totalPagado }) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-between">
                <p className="text-base font-medium">Progreso de Pago</p>
            </div>

            <div className="h-2 rounded-full bg-[#3d5245]">
                <div
                    className={`h-2 rounded-full ${gasto.fixed_expense ? 'bg-yellow-400' : 'bg-primary'}`}
                    style={{ width: `${porcentaje}%` }}
                />
            </div>

            <p className="text-sm text-[#9eb7a8]">
                {gasto.fixed_expense
                    ? `Veces pagado ${gasto.payed_quotas}`
                    : `${gasto.payed_quotas} de ${gasto.number_of_quotas} cuotas pagadas ($${totalPagado.toFixed(2)} / $${gasto.amount})`}
            </p>
        </div>
    );
}
