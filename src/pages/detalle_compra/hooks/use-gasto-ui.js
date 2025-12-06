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

    const { detalle, setDetalle, actualizar, pagarCuota, eliminar } = useGastoData();

    // -------------------------
    // CALCULOS DERIVADOS
    // -------------------------
    const totalPagado = useMemo(() => {
        if (!detalle) return 0;
        return detalle.cuotas.filter((c) => c.pagada).reduce((a, c) => a + c.monto, 0);
    }, [detalle]);

    const porcentaje = useMemo(() => {
        if (!detalle?.total) return 0;
        return Math.min(100, (totalPagado / detalle.total) * 100);
    }, [detalle, totalPagado]);

    // -------------------------
    // NAVEGACIÓN
    // -------------------------
    const volverALista = () => {
        if (!detalle) return;
        nav(detalle.tipo === 'ME_DEBEN' ? '/app/medeben' : '/app/debo');
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

        setDetalle((prev) => ({ ...prev, adjuntos: [...prev.adjuntos, ...nuevos] }));
    };

    return {
        // DATA
        detalle,
        totalPagado,
        porcentaje,

        // ACCIONES
        actualizar,
        pagarCuota,
        eliminar,
        onSeleccionAdjuntos,

        // NAVEGACIÓN
        volverALista,
    };
}
