import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerDeudas } from '../services/deudas';

const MOCK_DEUDAS = [
    { id: 'c1', titulo: 'Cuota 3/12 - Notebook', monto: 15000, moneda: 'ARS' },
    { id: 'c2', titulo: 'Factura Internet', monto: 12000, moneda: 'ARS' },
];

export default function Debo() {
    const [deudas, setDeudas] = useState([]);

    useEffect(() => {
        // Deudas que vienen de localStorage
        const extras = obtenerDeudas();
        // Mostramos mock + las nuevas
        setDeudas([...MOCK_DEUDAS, ...extras]);
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Debo</h1>

            {deudas.length === 0 && <p className="text-slate-500">No tenés deudas activas.</p>}

            <ul className="flex flex-col gap-3">
                {deudas.map((d) => (
                    <li
                        key={d.id}
                        className="rounded-lg border border-slate-700/50 bg-black/20 p-4 hover:bg-black/30"
                    >
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-900 dark:text-white">{d.titulo}</p>
                            <span className="text-red-400">
                                {d.moneda || 'ARS'}{' '}
                                {`$${Number(d.monto || 0).toLocaleString('es-AR')}`}
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
