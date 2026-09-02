import { useCallback, useEffect, useState } from 'react';
import { fetchDashboardData, createGasto } from '@/services/api';
import useAuth from '@/store/use-auth-store';
import { usePayments } from '@/hooks/use-payments';

export function useDashboardData() {
    const { token } = useAuth();
    const { handleConfirm } = usePayments(token);

    const [summaryByCurrency, setSummaryByCurrency] = useState(null);
    const [groups, setGroups] = useState([]);
    const [pendingTotal, setPendingTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const recalcSummary = useCallback((groupsToUse) => {
        const totals = {
            ARS: { debo: 0, meDeben: 0, cuotaDebo: 0, cuotaMeDeben: 0 },
            USD: { debo: 0, meDeben: 0, cuotaDebo: 0, cuotaMeDeben: 0 },
            EUR: { debo: 0, meDeben: 0, cuotaDebo: 0, cuotaMeDeben: 0 },
        };

        groupsToUse.forEach((group) => {
            group.items.forEach((g) => {
                const curr = g.currency_type;
                const restante = g.amount - g.payed_quotas * g.amount_per_quota;
                const cuota = Number(g.amount_per_quota || 0);

                if (g.type === 'INGRESO') {
                    totals[curr].meDeben += restante;
                    totals[curr].cuotaMeDeben += cuota;
                } else {
                    totals[curr].debo += restante;
                    totals[curr].cuotaDebo += cuota;
                }
            });
        });

        const summary = ['ARS', 'USD', 'EUR'].reduce((acc, cur) => {
            acc[cur] = {
                total_debo: totals[cur].debo,
                total_me_deben: totals[cur].meDeben,
                total_balance: totals[cur].meDeben - totals[cur].debo,
                cuota_debo: totals[cur].cuotaDebo,
                cuota_me_deben: totals[cur].cuotaMeDeben,
                cuota_balance: totals[cur].cuotaMeDeben - totals[cur].cuotaDebo,
            };
            return acc;
        }, {});

        setSummaryByCurrency(summary);
    }, []);

    const loadDashboard = useCallback(async () => {
        if (!token) return;

        try {
            setLoading(true);
            const entities = await fetchDashboardData(token);

            setPendingTotal(entities.reduce((sum, e) => sum + (Number(e.pending_count) || 0), 0));

            const mappedGroups = entities
                .map((entity) => {
                    const gastos = Array.isArray(entity.gastos) ? entity.gastos : [];

                    const items = gastos
                        .map((g) => ({
                            ...g,
                            progress: g.fixed_expense
                                ? 100
                                : g.number_of_quotas > 0
                                  ? Math.min((g.payed_quotas / g.number_of_quotas) * 100, 100)
                                  : g.payed_quotas === 0
                                    ? 0
                                    : 100,
                        }))
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                    if (items.length === 0) return null;

                    return { ...entity, items };
                })
                .filter(Boolean)
                .sort((a, b) => new Date(b.items[0].created_at) - new Date(a.items[0].created_at));

            setGroups(mappedGroups);
            recalcSummary(mappedGroups);
        } catch (err) {
            console.error('Error cargando dashboard:', err);
        } finally {
            setLoading(false);
        }
    }, [token, recalcSummary]);

    const updateAfterPayment = useCallback(
        (updatedItems) => {
            const updatedById = new Map(updatedItems.map((it) => [String(it.id), it]));

            const newGroups = groups
                .map((group) => {
                    const newItems = group.items
                        .map((it) => {
                            const server = updatedById.get(String(it.id));
                            if (!server) return it;

                            const updated = {
                                ...it,
                                ...server,
                                progress: server.fixed_expense
                                    ? 100
                                    : Math.min(
                                          (server.payed_quotas / server.number_of_quotas) * 100,
                                          100,
                                      ),
                            };

                            if (server.fixed_expense) return updated;

                            if (server.payed_quotas >= server.number_of_quotas) return null;

                            return updated;
                        })
                        .filter(Boolean);

                    return { ...group, items: newItems };
                })
                .filter((g) => g.items.length > 0);

            setGroups(newGroups);
            recalcSummary(newGroups);
        },
        [groups, recalcSummary],
    );

    const pagarCuotas = useCallback(
        async (items) => {
            const updatedItems = await handleConfirm(items);
            updateAfterPayment(updatedItems);
            return updatedItems;
        },
        [handleConfirm, updateAfterPayment],
    );

    const crearGasto = useCallback(
        async (payload) => {
            await createGasto(payload, token);
            await loadDashboard();
        },
        [token, loadDashboard],
    );

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    return {
        groups,
        setGroups,
        pendingTotal,
        summaryByCurrency,
        loadDashboard,
        getSummaryForCurrency: (currency) => summaryByCurrency?.[currency] ?? null,
        pagarCuotas,
        crearGasto,
        loading,
    };
}
