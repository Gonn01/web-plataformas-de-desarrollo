// src/pages/CompraDetalle.jsx
import { Link } from 'react-router-dom';
export default function CompraDetalle() {
    // Datos mock para mostrar progreso, etc.
    const total = 1200;
    const pagado = 300;
    // const cuotas = 12;
    const porcentaje = (pagado / total) * 100;

    return (
        <div className="min-h-dvh w-full bg-background-dark text-white font-display">
            <div className="px-4 md:px-10 lg:px-20 xl:px-40 py-6 sm:py-10 flex justify-center">
                <div className="w-full max-w-[960px] flex flex-col gap-8">
                    {/* 🔙 Botón para volver */}
                    <div>
                        <Link
                            to="/app/debo"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-base">arrow_back</span>
                            Volver a Debo
                        </Link>
                    </div>

                    {/* Migas */}
                    <div className="flex flex-wrap gap-2 text-sm">
                        <a className="text-[#9eb7a8] hover:text-primary transition-colors" href="#">
                            Inicio
                        </a>
                        <span className="text-[#9eb7a8]">/</span>
                        <a className="text-[#9eb7a8] hover:text-primary transition-colors" href="#">
                            Debo
                        </a>
                        <span className="text-[#9eb7a8]">/</span>
                        <span className="text-white">Compra Notebook</span>
                    </div>

                    {/* Título + acciones */}
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div>
                            <p className="text-4xl font-black tracking-[-0.033em]">
                                Compra Notebook
                            </p>
                            <div className="mt-2">
                                <span className="bg-yellow-400/20 text-yellow-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                                    Pendiente
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                            <button className="h-10 px-4 rounded-lg bg-primary text-background-dark text-sm font-bold hover:bg-opacity-90 transition-opacity">
                                Marcar cuota como pagada
                            </button>
                            <button className="h-10 px-4 rounded-lg bg-[#29382f] text-white text-sm font-bold hover:bg-opacity-80 transition-all">
                                Editar
                            </button>
                        </div>
                    </div>

                    {/* Tarjeta principal */}
                    <div className="bg-[#111714] rounded-xl p-6 shadow-sm flex flex-col gap-6">
                        {/* Datos clave */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
                            <InfoItem label="Entidad" value="Tienda de Electrónica" />
                            <InfoItem label="Monto Total" value={`$${total}`} />
                            <InfoItem label="Tipo" value="Compra Tarjeta" />
                            <InfoItem label="Moneda" value="USD" />
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
                                3 de 12 cuotas pagadas (${pagado} / ${total})
                            </p>
                        </div>
                    </div>

                    {/* Cuotas */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-xl font-bold">Cuotas</h2>

                        {/* Pagada */}
                        <Cuota
                            icon="check_circle"
                            title="Cuota #3"
                            venc="15 Mar 2024"
                            monto="$100.00"
                            paid
                        />

                        {/* Próxima */}
                        <Cuota
                            icon="arrow_circle_right"
                            title="Cuota #4"
                            venc="15 Abr 2024"
                            monto="$100.00"
                            next
                        />

                        {/* Futura */}
                        <Cuota
                            icon="schedule"
                            title="Cuota #5"
                            venc="15 May 2024"
                            monto="$100.00"
                        />
                    </section>

                    {/* Adjuntos */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Archivos Adjuntos</h2>
                            <button className="h-9 px-3 rounded-lg bg-[#29382f] text-sm font-bold hover:bg-opacity-80 transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">
                                    upload_file
                                </span>
                                Subir archivo
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            <img
                                className="aspect-square w-full rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                alt="Recibo de compra"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj77qzDIzB8C29rr_d17cpNDztVos5Bm2V661F5ItebT2S0HjNdINnLkCcDUwiZBXYl10ba6nnmJB4aqhPf_vaIhuGupEjAHMnelpAe5deCTi2ddTDKIyPC62hLBs_DVfFtRo5HPjfLWg7K4mc_OVzmI0lgtSGfSzbEiC6DC-au0TmcI-Fsar1-5LOSAe4BHsWE459xCthVFD6v1cLIKTlydS4bbP-kOFjXClIlt3JA7sDFN-lepVo-xtLAtO8nRCd5Bgam9gBTVw"
                            />
                            <img
                                className="aspect-square w-full rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                alt="Garantía"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsbvCoSgtX-JL4l5kEi9biatfhuzN_4wPhRd_heYmXYH3pKStWOhKl19gOJXDmQ-Tuh4NM-WlZ_2c1RdT3edlhMmkaNF5Zm45trrNpWxJUjzy2brz9qs805YAo1K4Mtl5ENE-GCbkWgZ1PDtShZykmkDXAjjCREdRfH6XH83R327TIw0Q0GrihOX7sJRBX-i-Lx8FDCR4TDEU2tcBiiW5kD7sFJESJvMm2a0DORZ59cJgb6ozh7oE20HV9GT_W4BXLPplblFgHgGA"
                            />
                            <div className="aspect-square w-full rounded-lg border-2 border-dashed border-gray-700 grid place-content-center text-center p-4">
                                <span className="material-symbols-outlined text-3xl text-gray-600">
                                    add_photo_alternate
                                </span>
                                <p className="text-sm text-gray-500 mt-2">Añadir más</p>
                            </div>
                        </div>
                    </section>

                    {/* Historial */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-xl font-bold">Historial de Actividad</h2>
                        <ul className="flex flex-col gap-4">
                            <HistItem
                                icon="receipt_long"
                                color="primary"
                                text={
                                    <>
                                        <b>Cuota #3</b> marcada como pagada.
                                    </>
                                }
                                date="15 Mar 2024, 10:30 AM"
                            />
                            <HistItem
                                icon="edit"
                                box="neutral"
                                text={`Se editó la entidad de "Tienda X" a "Tienda de Electrónica".`}
                                date="02 Ene 2024, 02:15 PM"
                            />
                            <HistItem
                                icon="add_circle"
                                box="neutral"
                                text="Se creó el registro de la deuda."
                                date="01 Ene 2024, 09:00 AM"
                            />
                        </ul>
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
                </div>
            </div>
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

function HistItem({ icon, text, date, color = 'neutral' }) {
    const circle = color === 'primary' ? 'bg-primary/20' : 'bg-[#29382f]';
    return (
        <li className="flex items-start gap-4">
            <div className={`h-10 w-10 rounded-full grid place-content-center ${circle}`}>
                <span className="material-symbols-outlined text-primary">{icon}</span>
            </div>
            <div>
                <p>{text}</p>
                <p className="text-sm text-[#9eb7a8]">{date}</p>
            </div>
        </li>
    );
}
