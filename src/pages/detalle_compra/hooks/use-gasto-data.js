import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/use-auth';
import { pagarCuota as pagarCuota2 } from '@/services/api';
import { fetchGastoById, updateGasto, deleteGasto } from '@/services/api';

/**
 * Hook de dominio adaptado EXACTAMENTE a la API REAL
 */
export function useGastoData() {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [gasto, setGasto] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        load();
    }, [id, token]);

    // -----------------------------------------
    // TRANSFORMADOR → convierte API → Modelo UI
    // -----------------------------------------
    function mapGasto(g) {
        const totalCuotas = Number(g.number_of_quotas) || 0;
        const pagadas = Number(g.payed_quotas) || 0;
        const amount = Number(g.amount) || 0;
        const amountPerQuota = Number(g.amount_per_quota) || amount;
        const isFixed = Boolean(g.fixed_expense);

        let cuotas = [];

        // --------------------------
        // GASTO FIJO
        // --------------------------
        if (isFixed) {
            cuotas = [
                {
                    nro: 1,
                    monto: amountPerQuota,
                    pagada: pagadas > 0,
                    proxima: pagadas === 0,
                    venc: 'Gasto fijo',
                },
            ];
        }
        // --------------------------
        // GASTO CON CUOTAS NORMALES
        // --------------------------
        else if (totalCuotas > 0) {
            cuotas = Array.from({ length: totalCuotas }, (_, i) => ({
                nro: i + 1,
                monto: amountPerQuota,
                pagada: i < pagadas,
                proxima: i === pagadas,
            }));
        }
        // --------------------------
        // GASTO ÚNICO (sin cuotas)
        // --------------------------
        else {
            cuotas = [
                {
                    nro: 1,
                    monto: amount,
                    pagada: pagadas > 0,
                    proxima: pagadas === 0,
                },
            ];
        }

        return {
            id: g.id,
            titulo: g.name,
            entidad: g.financial_entity_id,
            total: amount,
            moneda: g.currency_type === '1' ? 'ARS' : g.currency_type === '2' ? 'USD' : 'EUR',
            tipo: g.type === 'ME_DEBEN' ? 'Me deben' : 'Debo',
            cuotas,
            fijo: isFixed,
            finalization_date: g.finalization_date,
            logs: g.logs || [],
        };
    }

    // -----------------------------------------
    // CARGAR GASTO DESDE API
    // -----------------------------------------
    async function load() {
        try {
            setLoading(true);
            const res = await fetchGastoById(id, token);
            setGasto(mapGasto(res));
        } catch (err) {
            console.error('Error cargando gasto', err);
            navigate(`/app/entidades-financieras/${gasto.financial_entity_id}/gastos`);
        } finally {
            setLoading(false);
        }
    }

    // -----------------------------------------
    // ACTUALIZAR GASTO
    // -----------------------------------------
    async function actualizar(payload) {
        if (!gasto) return;
        setLoading(true);
        await updateGasto(gasto.id, payload, token);
        await load();
        setLoading(false);
    }

    // -----------------------------------------
    // PAGAR CUOTA
    // -----------------------------------------
    async function pagarCuota() {
        if (!gasto) return;
        setLoading(true);
        await pagarCuota2(gasto.id, token);
        await load();
        setLoading(false);
    }

    // -----------------------------------------
    // ELIMINAR GASTO
    // -----------------------------------------
    async function eliminar() {
        if (!gasto) return;
        setLoading(true);
        await deleteGasto(gasto.id, token);
        navigate(`/app/entidades-financieras/${gasto.financial_entity_id}/gastos`);
        setLoading(false);
    }

    return {
        gasto,
        actualizar,
        pagarCuota,
        eliminar,
        load,
        loading,
    };
}
