export default function Breadcrumb({ detalle, volverALista }) {
    return (
        <div className="flex flex-wrap gap-2 text-sm">
            <button
                onClick={() => (window.location.href = '/app/dashboard')}
                className="text-[#9eb7a8] hover:text-primary transition-colors"
            >
                Inicio
            </button>
            <span className="text-[#9eb7a8]">/</span>
            <button
                onClick={volverALista}
                className="text-[#9eb7a8] hover:text-primary transition-colors"
            >
                {detalle.tipo === 'Me deben' ? 'Me deben' : 'Debo'}
            </button>
            <span className="text-[#9eb7a8]">/</span>
            <span className="text-white">{detalle.titulo}</span>
        </div>
    );
}
