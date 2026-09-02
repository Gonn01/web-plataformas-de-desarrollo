import { useMemo } from 'react';
import { useReconcileStore } from '@/store/use-reconcile-store';

/** Estado derivado del "modo hacer cuentas". */
export function useReconcile() {
    const active = useReconcileStore((s) => s.active);
    const session = useReconcileStore((s) => s.session);
    const checkedExpenses = useReconcileStore((s) => s.checkedExpenses);
    const loading = useReconcileStore((s) => s.loading);

    const checkedCount = useMemo(() => Object.keys(checkedExpenses).length, [checkedExpenses]);

    return {
        active,
        session,
        startedAt: session?.started_at ?? null,
        startedLabel: session?.started_at ? relativeSince(session.started_at) : null,
        checkedExpenses,
        checkedCount,
        loading,
    };
}

function relativeSince(iso) {
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return null;
    const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
    if (mins < 1) return 'recién';
    if (mins < 60) return `hace ${mins} min`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.round(hours / 24);
    return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
}
