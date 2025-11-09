import { Link } from 'react-router-dom';

const MOCK_DEUDAS = [
    { id: 'c1', titulo: 'Cuota 3/12 - Notebook', monto: 15000 },
    { id: 'c2', titulo: 'Factura Internet', monto: 12000 },
];

export default function Debo() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Debo</h1>

            {MOCK_DEUDAS.length === 0 && <p className="text-slate-500">No tenés deudas activas.</p>}

            <ul className="flex flex-col gap-3">
                {MOCK_DEUDAS.map((d) => (
                    <li
                        key={d.id}
                        className="rounded-lg border border-slate-700/50 bg-black/20 p-4 hover:bg-black/30"
                    >
                        <div className="flex items-center justify-between">
                            <p className="font-medium">{d.titulo}</p>
                            <span className="text-red-400">
                                ARS ${d.monto.toLocaleString('es-AR')}
                            </span>
                        </div>
                        <div className="mt-3">
                            <Link
                                to={`/app/deuda/${d.id}`}
                                className="text-sm text-primary hover:underline"
                            >
                                Ver detalle
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
