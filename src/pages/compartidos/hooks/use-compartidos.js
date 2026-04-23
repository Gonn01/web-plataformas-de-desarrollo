import { useState, useEffect, useCallback } from 'react';
import {
    fetchCompartidos,
    aprobarCompartido,
    rechazarCompartido,
    reintentarCompartido,
} from '@/services/api';
import useAuth from '@/hooks/use-auth';
import { useCompartidosStore } from '@/store/use-compartidos-store';

export function useCompartidos() {
    const { token } = useAuth();
    const { setPendingCount } = useCompartidosStore();

    const [compartidos, setCompartidos] = useState({ recibidos: [], emitidos: [] });
    const [loading, setLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState(null);

    const load = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const data = await fetchCompartidos(token);
            setCompartidos(data);
            const pending = data.recibidos.filter((r) => r.status === 'PENDING_APPROVAL').length;
            setPendingCount(pending);
        } catch (err) {
            console.error('Error cargando compartidos', err);
        } finally {
            setLoading(false);
        }
    }, [token, setPendingCount]);

    useEffect(() => {
        load();
    }, [load]);

    const aprobar = useCallback(
        async (gastoId, financialEntityId, newEntityName) => {
            setLoadingAction(gastoId);
            try {
                await aprobarCompartido(
                    gastoId,
                    { financial_entity_id: financialEntityId ?? null, new_entity_name: newEntityName ?? null },
                    token,
                );
                await load();
            } finally {
                setLoadingAction(null);
            }
        },
        [token, load],
    );

    const rechazar = useCallback(
        async (gastoId) => {
            setLoadingAction(gastoId);
            try {
                await rechazarCompartido(gastoId, token);
                await load();
            } finally {
                setLoadingAction(null);
            }
        },
        [token, load],
    );

    const reintentar = useCallback(
        async (gastoId) => {
            setLoadingAction(gastoId);
            try {
                await reintentarCompartido(gastoId, token);
                await load();
            } finally {
                setLoadingAction(null);
            }
        },
        [token, load],
    );

    return {
        compartidos,
        loading,
        loadingAction,
        aprobar,
        rechazar,
        reintentar,
    };
}
