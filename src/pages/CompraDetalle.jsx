// src/pages/CompraDetalle.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { obtenerDeudaPorId, actualizarDeuda, eliminarDeuda } from '../services/deudas';

export default function CompraDetalle() {
    const nav = useNavigate();
    const { id } = useParams();

    const [detalle, setDetalle] = useState(null);
    const [editOpen, setEditOpen] = useState(false);

    // carga la deuda desde localStorage y arma las cuotas
    useEffect(() => {
        const base = obtenerDeudaPorId(id);

        if (!base) {
            nav('/app/debo');
            return;
        }

        const totalCuotas = Number(base.installments) || 1;
        const montoCuota = base.monto / totalCuotas;

        const cuotas = Array.from({ length: totalCuotas }, (_, i) => ({
            nro: i + 1,
            monto: montoCuota,
            pagada: false,
            proxima: i === 0,
            venc: 'Sin fecha',
        }));

        setDetalle({
            id: base.id,
            titulo: base.titulo,
            estado: 'Pendiente',
            entidad: base.entidad || 'Sin entidad',
            total: base.monto,
            moneda: base.moneda || base.currency || 'ARS',
            tipo: base.tipo || base.type || 'Debo',
            cuotas,
            adjuntos: [],
        });
    }, [id, nav]);

    const totalPagado = useMemo(() => {
        if (!detalle) return 0;
        return detalle.cuotas.filter((c) => c.pagada).reduce((a, c) => a + c.monto, 0);
    }, [detalle]);

    const porcentaje = useMemo(() => {
        if (!detalle || !detalle.total) return 0;
        return Math.min(100, (totalPagado / detalle.total) * 100);
    }, [detalle, totalPagado]);

    // volver a la lista
    const volverALista = () => {
        if (!detalle) {
            nav('/app/debo');
            return;
        }

        if (detalle.tipo === 'Me deben') {
            nav('/app/medeben');
        } else {
            nav('/app/debo');
        }
    };

    // marca la proxima cuota como pagada
    const marcarProximaComoPagada = () => {
        if (!detalle) return;

        // 1) calculamos TODO fuera de setDetalle (sin efectos secundarios)
        const idx = detalle.cuotas.findIndex((c) => c.proxima && !c.pagada);
        if (idx === -1) return;

        const nuevasCuotas = detalle.cuotas.map((c, i) =>
            i === idx ? { ...c, pagada: true, proxima: false } : c,
        );

        const nextIdx = nuevasCuotas.findIndex((c) => !c.pagada);
        if (nextIdx !== -1) {
            nuevasCuotas[nextIdx] = { ...nuevasCuotas[nextIdx], proxima: true };
        }

        const todasPagadas = nuevasCuotas.every((c) => c.pagada);
        const esMeDeben = detalle.tipo === 'Me deben';

        // 2) actualizamos el estado (sin alert ni nav adentro)
        setDetalle((prev) => ({
            ...prev,
            cuotas: nuevasCuotas,
        }));

        // 3) mensajes de felicitacion
        if (todasPagadas) {
            const mensaje = esMeDeben
                ? `¡Genial! Registraste que ya te pagaron "${detalle.titulo}".`
                : `¡Felicitaciones! Ya terminaste de pagar "${detalle.titulo}".`;

            alert(mensaje);

            eliminarDeuda(detalle.id);

            if (esMeDeben) {
                nav('/app/medeben');
            } else {
                nav('/app/debo');
            }
        } else {
            actualizarDeuda(detalle.id, {
                cuotasPagadas: nuevasCuotas.filter((c) => c.pagada).length,
            });
        }
    };

    const abrirEditar = () => {
        if (!detalle) return;
        setEditOpen(true);
    };

    // guarda los cambios que vienen del modal
    const guardarEdicion = ({ titulo, entidad, total, moneda, cantidadCuotas }) => {
        if (!detalle) return;

        const cant = Math.max(1, Number(cantidadCuotas) || 1);
        const nuevoTotal = Number(total) || 0;
        const montoCuota = cant > 0 ? nuevoTotal / cant : 0;

        const nuevasCuotas = Array.from({ length: cant }, (_, i) => ({
            nro: i + 1,
            monto: montoCuota,
            pagada: false,
            proxima: i === 0,
            venc: 'Sin fecha',
        }));

        const actualizado = {
            ...detalle,
            titulo,
            entidad,
            total: nuevoTotal,
            moneda,
            cuotas: nuevasCuotas,
        };

        setDetalle(actualizado);

        actualizarDeuda(detalle.id, {
            titulo,
            entidad,
            monto: nuevoTotal,
            moneda,
            installments: cant,
        });

        setEditOpen(false);
    };

    const onSeleccionAdjuntos = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const nuevos = files.map((f) => ({
            name: f.name,
            url: URL.createObjectURL(f),
        }));
        setDetalle((prev) => ({ ...prev, adjuntos: [...prev.adjuntos, ...nuevos] }));
    };

    if (!detalle) return null;

    return (
        <div className="min-h-dvh w-full bg-background-dark text-white font-display">
            <div className="px-4 md:px-10 lg:px-20 xl:px-40 py-6 sm:py-10 flex justify-center">
                <div className="w-full max-w-[960px] flex flex-col gap-8">
                    {/* migas */}
                    <div className="flex flex-wrap gap-2 text-sm">
                        <button
                            onClick={() => nav('/app/dashboard')}
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

                    {/* título + acciones */}
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

                    {/* tarjeta principal */}
                    <div className="bg-[#111714] rounded-xl p-6 shadow-sm flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
                            <InfoItem label="Entidad" value={detalle.entidad} />
                            <InfoItem label="Monto Total" value={`$${detalle.total}`} />
                            <InfoItem label="Tipo" value={detalle.tipo} />
                            <InfoItem label="Moneda" value={detalle.moneda} />
                        </div>

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
                                {`${detalle.cuotas.filter((c) => c.pagada).length} de ${detalle.cuotas.length
                                    } cuotas pagadas ($${totalPagado.toFixed(
                                        2,
                                    )} / $${detalle.total})`}
                            </p>
                        </div>
                    </div>

                    {/* cuotas */}
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

                    {/* adjuntos */}
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

                    {/* Eliminar deuda */}
                    <section className="mt-8 pt-6 border-t border-gray-800">
                        <h3 className="text-lg font-bold text-red-500">Zona de Peligro</h3>
                        <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p className="font-bold">Eliminar esta deuda</p>
                                <p className="text-sm text-gray-400">
                                    Una vez eliminada, esta acción no se puede deshacer.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    if (window.confirm('¿Seguro que querés eliminar esta deuda?')) {
                                        eliminarDeuda(detalle.id);
                                        volverALista();
                                    }
                                }}
                                className="h-10 px-4 rounded-lg text-sm font-bold border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                    </section>

                    <div className="pt-2">
                        <button
                            onClick={volverALista}
                            className="h-10 px-4 rounded-lg bg-[#29382f] text-white text-sm font-bold hover:bg-opacity-80 transition-all"
                        >
                            ← Volver a {detalle.tipo === 'Me deben' ? 'Me deben' : 'Debo'}
                        </button>
                    </div>
                </div>
            </div>

            {editOpen && (
                <EditDeudaModal
                    detalle={detalle}
                    onCancel={() => setEditOpen(false)}
                    onSave={guardarEdicion}
                />
            )}
        </div>
    );
}

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
                    className={`material-symbols-outlined ${paid
                        ? 'text-primary'
                        : next
                            ? 'text-primary animate-pulse'
                            : 'text-gray-600'
                        }`}
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

function EditDeudaModal({ detalle, onCancel, onSave }) {
    const [titulo, setTitulo] = useState(detalle.titulo || '');
    const [entidad, setEntidad] = useState(detalle.entidad || '');
    const [total, setTotal] = useState(detalle.total || 0);
    const [moneda, setMoneda] = useState(detalle.moneda || 'ARS');
    const [cantCuotas, setCantCuotas] = useState(detalle.cuotas?.length || 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            titulo: titulo.trim(),
            entidad: entidad.trim(),
            total: Number(total) || 0,
            moneda,
            cantidadCuotas: Number(cantCuotas) || 1,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <form
                onSubmit={handleSubmit}
                className="w-[90vw] max-w-md rounded-xl bg-[#111714] p-6 space-y-4 border border-[#29382f]"
            >
                <h2 className="text-lg font-bold text-white">Editar deuda</h2>

                <label className="flex flex-col gap-1 text-sm text-white">
                    Nombre
                    <input
                        className="h-10 rounded-lg border border-[#3d5245] bg-[#1c2620] px-3 text-sm text-white"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                </label>

                <label className="flex flex-col gap-1 text-sm text-white">
                    Entidad
                    <input
                        className="h-10 rounded-lg border border-[#3d5245] bg-[#1c2620] px-3 text-sm text-white"
                        value={entidad}
                        onChange={(e) => setEntidad(e.target.value)}
                    />
                </label>

                <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1 text-sm text-white">
                        Monto total
                        <input
                            type="number"
                            min="0"
                            className="h-10 rounded-lg border border-[#3d5245] bg-[#1c2620] px-3 text-sm text-white"
                            value={total}
                            onChange={(e) => setTotal(e.target.value)}
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm text-white">
                        Moneda
                        <select
                            className="h-10 rounded-lg border border-[#3d5245] bg-[#1c2620] px-3 text-sm text-white"
                            value={moneda}
                            onChange={(e) => setMoneda(e.target.value)}
                        >
                            <option value="ARS">ARS</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </label>
                </div>

                <label className="flex flex-col gap-1 text-sm text-white">
                    Cantidad de cuotas
                    <input
                        type="number"
                        min="1"
                        className="h-10 rounded-lg border border-[#3d5245] bg-[#1c2620] px-3 text-sm text-white"
                        value={cantCuotas}
                        onChange={(e) => setCantCuotas(e.target.value)}
                    />
                </label>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="h-10 px-4 rounded-lg text-sm font-bold text-[#9eb7a8] hover:bg-[#29382f]"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="h-10 px-4 rounded-lg bg-primary text-background-dark text-sm font-bold hover:opacity-90"
                    >
                        Guardar cambios
                    </button>
                </div>
            </form>
        </div>
    );
}
