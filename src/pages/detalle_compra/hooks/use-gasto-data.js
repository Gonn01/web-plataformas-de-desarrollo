import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '@/hooks/use-auth';

import { fetchGastoById, updateGasto, deleteGasto } from '@/services/api';
import { formatDate } from '@/utils/FormatDate';

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
    }, [token, id]);

    // (si no lo tenés, te lo hago después)

    async function load() {
        try {
            const gasto = await fetchGastoById(id, token);

            const totalCuotas = Number(gasto.number_of_quotas) || 0;
            const pagadas = Number(gasto.payed_quotas) || 0;

            // Para gastos por cuota: usar amount_per_quota si viene
            const montoCuota =
                totalCuotas > 0 ? Number(gasto.amount_per_quota) : Number(gasto.amount);

            // Fecha de vencimiento formateada si existe
            const vencimiento = gasto.first_quota_date
                ? formatDate(gasto.first_quota_date)
                : 'Sin fecha';

            let cuotas = [];

            if (gasto.fixed_expense) {
                // 🟦 Gasto fijo → NO tiene cuotas reales
                cuotas = [
                    {
                        nro: 1,
                        monto: montoCuota,
                        pagada: pagadas > 0,
                        proxima: pagadas === 0,
                        venc: 'Gasto fijo',
                    },
                ];
            } else if (totalCuotas > 0) {
                // 🟩 Gasto con cuotas
                cuotas = Array.from({ length: totalCuotas }, (_, i) => ({
                    nro: i + 1,
                    monto: montoCuota,
                    pagada: i < pagadas,
                    proxima: i === pagadas && pagadas < totalCuotas,
                    venc: vencimiento,
                }));
            } else {
                // 🟧 Gasto TOTAL sin cuotas
                cuotas = [
                    {
                        nro: 1,
                        monto: Number(gasto.amount),
                        pagada: pagadas > 0,
                        proxima: pagadas === 0,
                        venc: vencimiento,
                    },
                ];
            }

            setDetalle({
                id: gasto.id,
                titulo: gasto.name,
                entidad: gasto.financial_entity_id,
                total: Number(gasto.amount),
                moneda:
                    gasto.currency_type === '1'
                        ? 'ARS'
                        : gasto.currency_type === '2'
                            ? 'USD'
                            : 'EUR',
                tipo: gasto.type === 'ME_DEBEN' ? 'Me deben' : 'Debo',
                cuotas,
                fijo: gasto.fixed_expense,
                logs: gasto.logs || [],
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
