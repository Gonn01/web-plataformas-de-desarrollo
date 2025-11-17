//compraDetalle.jsx
import { useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';

// ---- Página ----
export default function CompraDetalle() {
    const nav = useNavigate();
    const { id } = useParams();

    // Mock local (luego podemos traer por id desde services/deudas.js)
    const [detalle, setDetalle] = useState({
        id,
        titulo: 'Compra Notebook',
        estado: 'Pendiente',
        entidad: 'Tienda de Electrónica',
        total: 1200,
        moneda: 'USD',
        tipo: 'Compra Tarjeta',
        cuotas: [
            { nro: 3, monto: 100, venc: '15 Mar 2024', pagada: true },
            { nro: 4, monto: 100, venc: '15 Abr 2024', pagada: false, proxima: true },
            { nro: 5, monto: 100, venc: '15 May 2024', pagada: false },
        ],
        adjuntos: [], // {name, url} locales
    });

    const totalPagado = useMemo(
        () => detalle.cuotas.filter((c) => c.pagada).reduce((a, c) => a + c.monto, 0),
        [detalle.cuotas],
    );
    const porcentaje = useMemo(
        () => Math.min(100, (totalPagado / detalle.total) * 100),
        [totalPagado, detalle.total],
    );

    const volverADebo = () => nav('/app/debo'); // o nav(-1) si preferís "volver" genérico

    const marcarProximaComoPagada = () => {
        setDetalle((prev) => {
            const idx = prev.cuotas.findIndex((c) => c.proxima && !c.pagada);
            if (idx === -1) return prev;
            const nuevas = prev.cuotas.map((c, i) =>
                i === idx ? { ...c, pagada: true, proxima: false } : c,
            );
            // Siguiente no pagada queda como "proxima"
            const nextIdx = nuevas.findIndex((c) => !c.pagada);
            if (nextIdx !== -1) nuevas[nextIdx] = { ...nuevas[nextIdx], proxima: true };
            return { ...prev, cuotas: nuevas };
        });
    };

    const abrirEditar = () => {
        alert('Abrir modal de edición (pendiente): cambiar entidad, total, moneda, etc.');
    };

    const onSeleccionAdjuntos = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const nuevos = files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
        setDetalle((prev) => ({ ...prev, adjuntos: [...prev.adjuntos, ...nuevos] }));
    };

    return (
        <div className="min-h-dvh w-full bg-background-dark text-white font-display">
            <div className="px-4 md:px-10 lg:px-20 xl:px-40 py-6 sm:py-10 flex justify-center">
                <div className="w-full max-w-[960px] flex flex-col gap-8">
                    {/* Migas */}
                    <div className="flex flex-wrap gap-2 text-sm">
                        <button
                            onClick={() => nav('/app/dashboard')}
                            className="text-[#9eb7a8] hover:text-primary transition-colors"
                        >
                            Inicio
                        </button>
                        <span className="text-[#9eb7a8]">/</span>
                        <button
                            onClick={volverADebo}
                            className="text-[#9eb7a8] hover:text-primary transition-colors"
                        >
                            Debo
                        </button>
                        <span className="text-[#9eb7a8]">/</span>
                        <span className="text-white">{detalle.titulo}</span>
                    </div>

                    {/* Título + acciones */}
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div>
                            <p className="text-4xl font-black tracking-[-0.033em]">
                                {detalle.titulo}
                            </p>
                            <div className="mt-2">
                                <span className="bg-yellow-400/20 text-yellow-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                                    {detalle.estado}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                            <button
                                onClick={marcarProximaComoPagada}
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

                    {/* Tarjeta principal */}
                    <div className="bg-[#111714] rounded-xl p-6 shadow-sm flex flex-col gap-6">
                        {/* Datos clave */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
                            <InfoItem label="Entidad" value={detalle.entidad} />
                            <InfoItem label="Monto Total" value={`$${detalle.total}`} />
                            <InfoItem label="Tipo" value={detalle.tipo} />
                            <InfoItem label="Moneda" value={detalle.moneda} />
                        </div>

                        {/* Progreso */}
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between">
                                <p className="text-base font-medium">Progreso de Pago</p>
                            </div>
                            <div className="h-2 rounded-full bg-[#3d5245]">
                                <div
                                    className="h-2 rounded-full bg-primary"
                                    style={{ width: `${porcentaje}%` }}
                                />
                            </div>
                            <p className="text-sm text-[#9eb7a8]">
                                {`${detalle.cuotas.filter((c) => c.pagada).length} de ${detalle.cuotas.length} cuotas pagadas ($${totalPagado} / $${detalle.total})`}
                            </p>
                        </div>
                    </div>

                    {/* Cuotas */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-xl font-bold">Cuotas</h2>
                        {detalle.cuotas.map((c) => (
                            <Cuota
                                key={c.nro}
                                icon={
                                    c.pagada
                                        ? 'check_circle'
                                        : c.proxima
                                          ? 'arrow_circle_right'
                                          : 'schedule'
                                }
                                title={`Cuota #${c.nro}`}
                                venc={c.venc}
                                monto={`$${c.monto.toFixed(2)}`}
                                paid={c.pagada}
                                next={!!c.proxima}
                            />
                        ))}
                    </section>

                    {/* Adjuntos */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Archivos Adjuntos</h2>
                            <label className="h-9 px-3 rounded-lg bg-[#29382f] text-sm font-bold hover:bg-opacity-80 transition-all flex items-center gap-2 cursor-pointer">
                                <span className="material-symbols-outlined text-base">
                                    upload_file
                                </span>
                                Subir archivo
                                <input
                                    type="file"
                                    className="hidden"
                                    multiple
                                    onChange={onSeleccionAdjuntos}
                                />
                            </label>
                        </div>

                        {detalle.adjuntos.length === 0 && (
                            <div className="text-sm text-[#9eb7a8]">Sin adjuntos.</div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {detalle.adjuntos.map((f, i) => (
                                <img
                                    key={i}
                                    alt={f.name}
                                    className="aspect-square w-full rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                    src={f.url}
                                />
                            ))}
                            <div className="aspect-square w-full rounded-lg border-2 border-dashed border-gray-700 grid place-content-center text-center p-4">
                                <span className="material-symbols-outlined text-3xl text-gray-600">
                                    add_photo_alternate
                                </span>
                                <p className="text-sm text-gray-500 mt-2">Añadir más</p>
                            </div>
                        </div>
                    </section>
                    {/* Zona de peligro */}
                    <section className="mt-8 pt-6 border-t border-gray-800">
                        <h3 className="text-lg font-bold text-red-500">Zona de Peligro</h3>
                        <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p className="font-bold">Eliminar esta deuda</p>
                                <p className="text-sm text-gray-400">
                                    Una vez eliminada, esta acción no se puede deshacer.
                                </p>
                            </div>
                            <button className="h-10 px-4 rounded-lg text-sm font-bold border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors">
                                Eliminar
                            </button>
                        </div>
                    </section>

                    {/* Botón Volver fijo abajo (opcional) */}
                    <div className="pt-2">
                        <button
                            onClick={volverADebo}
                            className="h-10 px-4 rounded-lg bg-[#29382f] text-white text-sm font-bold hover:bg-opacity-80 transition-all"
                        >
                            ← Volver a Debo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---- Subcomponentes ----
function InfoItem({ label, value }) {
    return (
        <div className="flex flex-col gap-1">
            <p className="text-sm text-[#9eb7a8]">{label}</p>
            <p className="text-base font-medium text-white">{value}</p>
        </div>
    );
}

function Cuota({ icon, title, venc, monto, paid, next }) {
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
                    <p className="text-sm text-[#9eb7a8]">Vencimiento: {venc}</p>
                </div>
            </div>
            <p className={`font-semibold ${paid ? 'line-through text-white' : 'text-white'}`}>
                {monto}
            </p>
        </div>
    );
}
