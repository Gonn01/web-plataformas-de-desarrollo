import HeaderDetalle from './components/HeaderDetalle';
import InfoItem from './components/InfoItem';
import ProgresoPago from './components/ProgresoPago';
import CuotasSection from './components/CuotasSection';
import AdjuntosSection from './components/AdjuntosSection';
import PeligroEliminar from './components/PeligroEliminar';
import EditDeudaModal from './components/modals/EditDeudaModal';
import Breadcrumb from './components/Breadcrumb';

import { useCompraDetalle } from './hooks/use-compra-detalle';

export default function CompraDetalle() {
    const {
        detalle,
        editOpen,
        setEditOpen,
        porcentaje,
        totalPagado,
        volverALista,
        marcarProximaComoPagada,
        guardarEdicion,
        onSeleccionAdjuntos,
        eliminarDeuda,
    } = useCompraDetalle();

    if (!detalle) return null;

    return (
        <div className="min-h-dvh w-full bg-background-dark text-white font-display">
            <div className="px-4 md:px-10 lg:px-20 xl:px-40 py-6 sm:py-10 flex justify-center">
                <div className="w-full max-w-[960px] flex flex-col gap-8">
                    <Breadcrumb detalle={detalle} volverALista={volverALista} />

                    <HeaderDetalle
                        detalle={detalle}
                        marcarProxima={marcarProximaComoPagada}
                        abrirEditar={() => setEditOpen(true)}
                    />

                    <div className="bg-[#111714] rounded-xl p-6 shadow-sm flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
                            <InfoItem label="Entidad" value={detalle.entidad} />
                            <InfoItem label="Monto Total" value={`$${detalle.total}`} />
                            <InfoItem label="Tipo" value={detalle.tipo} />
                            <InfoItem label="Moneda" value={detalle.moneda} />
                        </div>

                        <ProgresoPago
                            detalle={detalle}
                            porcentaje={porcentaje}
                            totalPagado={totalPagado}
                        />
                    </div>

                    <CuotasSection cuotas={detalle.cuotas} />

                    <AdjuntosSection
                        adjuntos={detalle.adjuntos}
                        onSeleccionAdjuntos={onSeleccionAdjuntos}
                    />

                    <PeligroEliminar
                        onDelete={() => {
                            eliminarDeuda(detalle.id);
                            volverALista();
                        }}
                    />

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
