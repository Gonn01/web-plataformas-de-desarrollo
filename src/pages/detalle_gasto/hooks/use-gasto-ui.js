import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGastoData } from './use-gasto-data';

/**
 * Hook exclusivamente para la UI.
 * - Navegación
 * - Cálculos derivados (porcentaje, total pagado)
 * - Adjuntos
 * - Exponer funciones del dominio con nombres amigables para UI
 */
export function useGastoUI() {
    const nav = useNavigate();

    const { gasto, setGasto, actualizar, pagarCuota, eliminar, loading } = useGastoData();

    // ----------------------
    // CALCULOS DERIVADOS
    // -------------------------
    const totalPagado = useMemo(() => {
        if (!gasto) return 0;
        return gasto.payed_quotas * gasto.amount_per_quota;
    }, [gasto]);

    const porcentaje = useMemo(() => {
        return gasto ? (totalPagado / gasto.amount) * 100 : 0;
    }, [gasto, totalPagado]);

    // -------------------------
    // NAVEGACIÓN
    // -------------------------
    const volverALista = () => {
        if (!gasto) return;
        nav(`/app/entidades/${gasto.financial_entity_id}`);
    };

    // -------------------------
    // ADJUNTOS
    // -------------------------
    const onSeleccionAdjuntos = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const nuevos = files.map((f) => ({
            name: f.name,
            url: URL.createObjectURL(f),
        }));

        setGasto((prev) => ({ ...prev, adjuntos: [...prev.adjuntos, ...nuevos] }));
    };

    return {
        // DATA
        gasto,
        totalPagado,
        porcentaje,
        loading,
        // ACCIONES
        actualizar,
        pagarCuota,
        eliminar,
        onSeleccionAdjuntos,

        // NAVEGACIÓN
        volverALista,
    };
}
