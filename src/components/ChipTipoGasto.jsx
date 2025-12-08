export function ChipTipoGasto({ fijo, tipo, column = false }) {
    const tipoColor =
        tipo == 'ME_DEBEN' || tipo === 'Me deben'
            ? 'bg-green-400/20 text-green-400'
            : 'bg-red-400/20 text-red-400';

    const fijoChip = (
        <span className="text-center text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-400/20 text-yellow-400">
            Gasto fijo
        </span>
    );

    const tipoChip = (
        <span className={`text-center text-xs font-semibold px-2.5 py-1 rounded-full ${tipoColor}`}>
            {tipo == 'ME_DEBEN' || tipo === 'Me deben' ? 'Me deben' : 'Debo'}
        </span>
    );

    // Si es fijo → mostrar ambos chips
    if (fijo) {
        return (
            <div className={`flex ${column ? 'flex-col' : 'items-center'} gap-2`}>
                {fijoChip}
                {tipoChip}
            </div>
        );
    }

    // Si NO es fijo → chip único
    return tipoChip;
}
