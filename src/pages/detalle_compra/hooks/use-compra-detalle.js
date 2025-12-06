import useAuth from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';

import { useDeuda } from './use-deuda';
import { useCuotas } from './use-cuotas';

export function useCompraDetalle() {
    const nav = useNavigate();
    const { token } = useAuth();

    const volverALista = () => nav('/app/debo');

    const { detalle, setDetalle, guardarEdicion, eliminarDeuda } = useDeuda();
    const { totalPagado, porcentaje, marcarProximaComoPagada } = useCuotas(
        detalle,
        setDetalle,
        token,
    );

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
        detalle,
        totalPagado,
        porcentaje,
        marcarProximaComoPagada,
        guardarEdicion,
        eliminarDeuda,
        volverALista,
        onSeleccionAdjuntos,
    };
}
