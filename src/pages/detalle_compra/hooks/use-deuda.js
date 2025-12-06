import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '@/hooks/use-auth';

import { fetchGastoById, updateGasto, deleteGasto } from '@/services/api';

export function useDeuda() {
    const { token } = useAuth();
    const { id } = useParams();
    const nav = useNavigate();

    const [detalle, setDetalle] = useState(null);

    useEffect(() => {
        if (!token) return;

        const load = async () => {
            try {
                const gasto = await fetchGastoById(id, token);

                const totalCuotas = Number(gasto.number_of_quotas) || 1;
                const montoCuota = gasto.amount / totalCuotas;

                const cuotas = Array.from({ length: totalCuotas }, (_, i) => ({
                    nro: i + 1,
                    monto: montoCuota,
                    pagada: i < gasto.payed_quotas,
                    proxima: i === gasto.payed_quotas,
                    venc: gasto.first_quota_date || 'Sin fecha',
                }));

                setDetalle({
                    id: gasto.id,
                    titulo: gasto.name,
                    entidad: gasto.financial_entity_id,
                    total: gasto.amount,
                    moneda: gasto.currency_type,
                    tipo: gasto.type, // Debo / Me deben
                    cuotas,
                    adjuntos: [],
                });
            } catch (err) {
                console.error('Error cargando gasto', err);
                nav('/app/debo');
            }
        };

        load();
    }, [id, token, nav]);

    const guardarEdicion = async ({ titulo, entidad, total, moneda, cantidadCuotas }) => {
        if (!detalle) return;

        const payload = {
            name: titulo,
            financial_entity_id: entidad,
            amount: total,
            currency_type: moneda,
            number_of_quotas: cantidadCuotas,
        };

        await updateGasto(detalle.id, payload, token);

        // reflejamos en FE
        const montoCuota = total / cantidadCuotas;
        const nuevasCuotas = Array.from({ length: cantidadCuotas }, (_, i) => ({
            nro: i + 1,
            monto: montoCuota,
            pagada: false,
            proxima: i === 0,
            venc: 'Sin fecha',
        }));

        setDetalle({
            ...detalle,
            titulo,
            entidad,
            total,
            moneda,
            cuotas: nuevasCuotas,
        });
    };

    const eliminarDeuda = async () => {
        if (!detalle) return;

        await deleteGasto(detalle.id, token);

        nav(detalle.tipo === 'Me deben' ? '/app/medeben' : '/app/debo');
    };

    return {
        detalle,
        setDetalle,
        guardarEdicion,
        eliminarDeuda,
    };
}
