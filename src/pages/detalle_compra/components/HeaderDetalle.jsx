export default function HeaderDetalle({ detalle, marcarProxima, abrirEditar }) {
    return (
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
                <p className="text-4xl font-black tracking-[-0.033em]">{detalle.titulo}</p>
                <div className="mt-2">
                    <span className="bg-yellow-400/20 text-yellow-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {detalle.estado}
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <button
                    onClick={marcarProxima}
                    className="h-10 px-4 rounded-lg bg-primary text-background-dark text-sm font-bold hover:bg-opacity-90 transition-opacity"
                >
                    Marcar cuota como pagada
                </button>
                <button
                    onClick={abrirEditar}
                    className="h-10 px-4 rounded-lg bg-[#29382f] text-white text-sm font-bold hover:bg-opacity-80 transition-all"
                >
                    Editar
                </button>
            </div>
        </div>
    );
}
