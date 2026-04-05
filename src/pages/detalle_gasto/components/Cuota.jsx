export default function Cuota({ icon, title, monto, currency, paymentDate, paid, next }) {
    const formattedDate = paymentDate
        ? new Date(paymentDate).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : null;
    const base = 'flex items-center justify-between p-4 rounded-lg shadow-sm bg-[#111714]';
    const mods = paid ? 'opacity-60' : next ? 'border border-primary/50' : '';

    return (
        <div className={`${base} ${mods}`}>
            <div className="flex items-center gap-4">
                <span
                    className={`material-symbols-outlined ${paid ? 'text-primary' : next ? 'text-primary animate-pulse' : 'text-gray-600'}`}
                >
                    {icon}
                </span>

                <div className="flex flex-col">
                    <p className={`font-medium ${paid ? 'line-through text-white' : 'text-white'}`}>
                        {title}
                    </p>
                    <p className="text-sm text-[#9eb7a8]">
                        {paid ? `Pagada el ${formattedDate}` : next ? 'Proxima' : 'Pendiente'}
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-end">
                <p className={`font-semibold ${paid ? 'line-through text-white' : 'text-white'}`}>
                    {monto}
                </p>
                <span className="text-xs text-[#9eb7a8]">{currency}</span>
            </div>
        </div>
    );
}
