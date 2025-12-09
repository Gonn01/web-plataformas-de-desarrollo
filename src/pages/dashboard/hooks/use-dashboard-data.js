import { useCallback, useEffect, useState } from 'react';
import { fetchDashboardData } from '@/services/api';
import useAuth from '@/hooks/use-auth';
import { currencyCodeToLabel } from '@/pages/Configuracion';

export function useDashboardData() {
    const { token } = useAuth();

    const [summaryByCurrency, setSummaryByCurrency] = useState(null);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);

    // =========================================
    // CALCULAR BALANCES LOCALMENTE
    // =========================================
    const recalcSummary = useCallback((groupsToUse) => {
        const totals = {
            ARS: { debo: 0, meDeben: 0 },
            USD: { debo: 0, meDeben: 0 },
            EUR: { debo: 0, meDeben: 0 },
        };

        groupsToUse.forEach((group) => {
            group.items.forEach((g) => {
                const curr = currencyCodeToLabel(g.currency_type);
                const restante = g.amount - g.payed_quotas * g.amount_per_quota;

                if (g.type === 'ME_DEBEN') {
                    totals[curr].meDeben += restante;
                } else {
                    totals[curr].debo += restante;
                }
            });
        });

        const summary = ['ARS', 'USD', 'EUR'].reduce((acc, cur) => {
            acc[cur] = {
                total_debo: totals[cur].debo,
                total_me_deben: totals[cur].meDeben,
                total_balance: totals[cur].meDeben - totals[cur].debo,
            };
            return acc;
        }, {});

        setSummaryByCurrency(summary);
    }, []);

    // =========================================
    // CARGA INICIAL DESDE API
    // =========================================
    const loadDashboard = useCallback(async () => {
        if (!token) return;

        try {
            setLoading(true);
            const entities = await fetchDashboardData(token);

            const mappedGroups = entities
                .map((entity) => {
                    const gastos = Array.isArray(entity.gastos) ? entity.gastos : [];

                    const items = gastos.map((g) => ({
                        ...g,
                        progress: g.fixed_expense
                            ? 100
                            : g.number_of_quotas > 0
                                ? Math.min((g.payed_quotas / g.number_of_quotas) * 100, 100)
                                : g.payed_quotas === 0
                                    ? 0
                                    : 100,
                    }));

                    if (items.length === 0) return null;

                    return { ...entity, items };
                })
                .filter(Boolean);

            setGroups(mappedGroups);
            recalcSummary(mappedGroups);

        } catch (err) {
            console.error('Error cargando dashboard:', err);
        } finally {
            setLoading(false);
        }
    }, [token, recalcSummary]);

    // =========================================
    // ACTUALIZACIÓN LOCAL TRAS PAGAR CUOTAS
    // =========================================
    const updateAfterPayment = useCallback(
        (paidItems) => {
            const paidIds = new Set(paidItems.map((i) => i.id));

            const newGroups = groups
                .map((group) => {
                    const newItems = group.items
                        .map((it) => {
                            if (!paidIds.has(it.id)) return it;

                            const newPaid = it.payed_quotas + 1;

                            const updated = {
                                ...it,
                                payed_quotas: newPaid,
                                progress: it.fixed_expense
                                    ? 100
                                    : Math.min((newPaid / it.number_of_quotas) * 100, 100),
                            };

                            // si es gasto fijo, no se elimina nunca
                            if (it.fixed_expense) return updated;

                            // si completó las cuotas → se elimina
                            if (newPaid >= it.number_of_quotas) return null;

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

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    return {
        groups,
        setGroups,
        summaryByCurrency,
        loadDashboard,
        getSummaryForCurrency: (currency) => summaryByCurrency?.[currency] ?? null,
        updateAfterPayment,
        loading,
    };
}
