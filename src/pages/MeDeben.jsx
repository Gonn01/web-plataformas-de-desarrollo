// src/pages/MeDeben.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerDeudas } from '../services/deudas';

export default function MeDeben() {
    const [deudas, setDeudas] = useState([]);

    useEffect(() => {
        const todas = obtenerDeudas();
        // sólo las que son "Me deben"
        const soloMeDeben = todas.filter((d) => d.tipo === 'Me deben');
        setDeudas(soloMeDeben);
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Me deben</h1>

            {deudas.length === 0 && <p className="text-slate-500">No tenés deudas a tu favor.</p>}

            <ul className="flex flex-col gap-3">
                {deudas.map((d) => (
                    <li
                        key={d.id}
                        className="rounded-lg border border-slate-700/50 bg-black/20 p-4 hover:bg-black/30"
                    >
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-900 dark:text-white">{d.titulo}</p>
                            <span className="text-emerald-400">
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
