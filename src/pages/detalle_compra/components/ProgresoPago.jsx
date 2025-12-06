export default function ProgresoPago({ detalle, porcentaje, totalPagado }) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-between">
                <p className="text-base font-medium">Progreso de Pago</p>
            </div>

            <div className="h-2 rounded-full bg-[#3d5245]">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${porcentaje}%` }} />
            </div>

            <p className="text-sm text-[#9eb7a8]">
                {`${detalle.cuotas.filter((c) => c.pagada).length} de ${detalle.cuotas.length} cuotas pagadas ($${totalPagado.toFixed(2)} / $${detalle.total})`}
            </p>
        </div>
    );
}
