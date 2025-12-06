import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '@/hooks/use-auth';

import { fetchGastoById, updateGasto, deleteGasto } from '@/services/api';

/**
 * Hook de dominio.
 * Maneja toda la lógica REAL del gasto:
 * - Carga
 * - Transformación del modelo
 * - Actualización
 * - Pago de cuotas
 * - Eliminación
 */
export function useGastoData() {
    const { id } = useParams();
    const { token } = useAuth();

    const [detalle, setDetalle] = useState(null);

    // -------------------------
    // CARGA DEL GASTO
    // -------------------------
    useEffect(() => {
        if (!token) return;
        load();
    }, [id, token]);

    async function load() {
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
                tipo: gasto.type, // 'DEBO' | 'ME_DEBEN'
                cuotas,
                adjuntos: [],
            });
        } catch (err) {
            console.error('Error cargando gasto', err);
        }
    }

    // -------------------------
    // ACTUALIZAR
    // -------------------------
    async function actualizar(data) {
        await updateGasto(detalle.id, data, token);
        await load(); // recargar para mantener consistencia
    }

    // -------------------------
    // PAGO DE CUOTA
    // -------------------------
    async function pagarCuota() {
        if (!detalle) return;

        const idx = detalle.cuotas.findIndex((c) => c.proxima && !c.pagada);
        if (idx === -1) return;

        const nuevas = detalle.cuotas.map((c, i) => ({
            ...c,
            pagada: i === idx ? true : c.pagada,
            proxima: false,
        }));

        const siguiente = nuevas.findIndex((c) => !c.pagada);
        if (siguiente !== -1) {
            nuevas[siguiente] = { ...nuevas[siguiente], proxima: true };
        }

        const pagadas = nuevas.filter((c) => c.pagada).length;

        await updateGasto(detalle.id, { payed_quotas: pagadas }, token);

        setDetalle((prev) => ({ ...prev, cuotas: nuevas }));
    }

    // -------------------------
    // ELIMINAR
    // -------------------------
    async function eliminar() {
        await deleteGasto(detalle.id, token);
    }

    return {
        detalle,
        setDetalle, // útil para UI
        actualizar,
        pagarCuota,
        eliminar,
    };
}
