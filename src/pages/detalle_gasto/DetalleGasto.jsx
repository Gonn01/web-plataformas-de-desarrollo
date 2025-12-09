import { useState } from 'react';

import HeaderDetalle from './components/HeaderDetalle';
import InfoItem from './components/InfoItem';
import ProgresoPago from './components/ProgresoPago';
import CuotasSection from './components/CuotasSection';
// import AdjuntosSection from './components/AdjuntosSection';
import PeligroEliminar from '../../components/PeligroEliminar';
import { useGastoUI } from './hooks/use-gasto-ui';
import Loader from '@/components/Loader';
import { useEntitiesStore } from '@/store/use-entities-store';
import UpdateExpenseModal from '@/components/modals/Expenses/UpdateExpense/UpdateExpenseModal';
import { currencyCodeToLabel } from '../Configuracion';

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
    const { getEntityById } = useEntitiesStore();
    const [editOpen, setEditOpen] = useState(false);

    if (loading) {
        return <Loader />;
    }

    if (!gasto) return null;
    console.log('Gasto en DetalleGasto:', gasto);
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
                            <InfoItem
                                label="Entidad"
                                value={getEntityById(gasto.financial_entity_id)?.name}
                            />
                            <InfoItem label="Monto Total" value={`$${gasto.amount}`} />
                            <InfoItem
                                label="Moneda"
                                value={currencyCodeToLabel(gasto.currency_type)}
                            />
                        </div>

                        <ProgresoPago
                            gasto={gasto}
                            porcentaje={porcentaje}
                            totalPagado={totalPagado}
                            loading={loading}
                        />
                    </div>
                    {!gasto.fixed_expense && <CuotasSection gasto={gasto} loading={loading} />}

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
                <UpdateExpenseModal
                    gasto={gasto}
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    onSave={async (payload) => {
                        await actualizar(payload);
                        setEditOpen(false);
                    }}
                />
            )}
        </div>
    );
}
