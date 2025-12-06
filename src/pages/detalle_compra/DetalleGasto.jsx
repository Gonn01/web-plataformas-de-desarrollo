import { useState } from 'react';

import HeaderDetalle from './components/HeaderDetalle';
import InfoItem from './components/InfoItem';
import ProgresoPago from './components/ProgresoPago';
import CuotasSection from './components/CuotasSection';
// import AdjuntosSection from './components/AdjuntosSection';
import PeligroEliminar from '../../components/PeligroEliminar';
import EditDeudaModal from './components/modals/EditDeudaModal';
import { useGastoUI } from './hooks/use-gasto-ui';
import Loader from '@/components/Loader';

export default function DetalleGasto() {
    const {
        gasto,
        porcentaje,
        totalPagado,
        pagarCuota,
        actualizar,
        eliminar,
        loading,
        volverALista,
        // onSeleccionAdjuntos,
    } = useGastoUI();

    const [editOpen, setEditOpen] = useState(false);

    if (loading) {
        return <Loader />;
    }

    if (!gasto) return null;

    return (
        <div className="min-h-dvh w-full bg-background-dark text-white font-display">
            <div className="px-4 md:px-10 lg:px-20 xl:px-40 py-6 flex justify-center">
                <div className="w-full max-w-[960px] flex flex-col gap-8">
                    {!loading ? (
                        <HeaderDetalle
                            gasto={gasto}
                            marcarProxima={pagarCuota}
                            abrirEditar={() => setEditOpen(true)}
                        />
                    ) : null}
                    <div className="bg-[#111714] rounded-xl p-6 shadow-sm flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
                            <InfoItem label="Entidad" value={gasto.entidad} />
                            <InfoItem label="Monto Total" value={`$${gasto.total}`} />
                            <InfoItem label="Tipo" value={gasto.tipo} />
                            <InfoItem label="Moneda" value={gasto.moneda} />
                        </div>

                        <ProgresoPago
                            gasto={gasto}
                            porcentaje={porcentaje}
                            totalPagado={totalPagado}
                            loading={loading}
                        />
                    </div>

                    <CuotasSection cuotas={gasto.cuotas} loading={loading} />

                    {/* <AdjuntosSection
                        adjuntos={detalle.adjuntos}
                        onSeleccionAdjuntos={onSeleccionAdjuntos}
                    /> */}

                    <PeligroEliminar
                        onDelete={() => {
                            eliminar();
                            volverALista();
                        }}
                    />
                </div>
            </div>

            {/* MODAL EDITAR */}
            {editOpen && (
                <EditDeudaModal
                    gasto={gasto}
                    onCancel={() => setEditOpen(false)}
                    onSave={(payload) => {
                        actualizar(payload);
                        setEditOpen(false);
                    }}
                />
            )}
        </div>
    );
}
