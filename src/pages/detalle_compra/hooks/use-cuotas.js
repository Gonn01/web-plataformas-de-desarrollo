import { useMemo } from 'react';
import { updateGasto } from '@/services/api';

export function useCuotas(detalle, setDetalle, token) {
    const totalPagado = useMemo(() => {
        if (!detalle) return 0;
        return detalle.cuotas.filter((c) => c.pagada).reduce((acc, c) => acc + c.monto, 0);
    }, [detalle]);

    const porcentaje = useMemo(() => {
        if (!detalle) return 0;
        return (totalPagado / detalle.total) * 100;
    }, [detalle, totalPagado]);

    const marcarProximaComoPagada = async () => {
        if (!detalle) return;

        const idx = detalle.cuotas.findIndex((c) => c.proxima && !c.pagada);
        if (idx === -1) return;

        const nuevasCuotas = detalle.cuotas.map((c, i) => ({
            ...c,
            pagada: i === idx ? true : c.pagada,
            proxima: false,
        }));

        const siguiente = nuevasCuotas.findIndex((c) => !c.pagada);
        if (siguiente !== -1) {
            nuevasCuotas[siguiente] = { ...nuevasCuotas[siguiente], proxima: true };
        }

        const pagadas = nuevasCuotas.filter((c) => c.pagada).length;

        // Persistimos en backend
        await updateGasto(detalle.id, { payed_quotas: pagadas }, token);

        setDetalle({ ...detalle, cuotas: nuevasCuotas });
    };

    return {
        totalPagado,
        porcentaje,
        marcarProximaComoPagada,
    };
}
