import { useCallback, useEffect, useState } from 'react';
import { fetchDashboardData } from '@/services/api';
import useAuth from '@/hooks/use-auth';
import { currencyCodeToLabel } from '@/pages/Configuracion';

export function useDashboardData() {
    const { token } = useAuth();

    const [summaryByCurrency, setSummaryByCurrency] = useState(null);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadDashboard = useCallback(async () => {
        if (!token) return;

        try {
            setLoading(true);
            const entities = await fetchDashboardData(token);

            const totals = {
                ARS: { debo: 0, meDeben: 0 },
                USD: { debo: 0, meDeben: 0 },
                EUR: { debo: 0, meDeben: 0 },
            };

            const mappedGroups = entities.map((entity) => {
                const gastos = Array.isArray(entity.gastos) ? entity.gastos : [];

                const items = gastos.map((g) => {
                    if (g.type == 'ME_DEBEN') {
                        totals[currencyCodeToLabel(g.currency_type)].meDeben +=
                            g.amount - g.payed_quotas * g.amount_per_quota;
                    } else {
                        totals[currencyCodeToLabel(g.currency_type)].debo += g.amount - g.payed_quotas * g.amount_per_quota;
                    }

                    return {
                        ...g,
                        progress: g.fixed_expense
                            ? 100
                            : g.number_of_quotas > 0
                                ? Math.min((g.payed_quotas / g.number_of_quotas) * 100, 100)
                                : g.payed_quotas === 0
                                    ? 0
                                    : 100,
                    };
                });

                if (items.length === 0) return null;

                return {
                    ...entity,
                    items,
                };
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
            setGroups(mappedGroups.filter(Boolean));
        } catch (err) {
            console.error('Error cargando dashboard:', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const getSummaryForCurrency = useCallback(
        (currency) => summaryByCurrency?.[currency] || null,
        [summaryByCurrency],
    );

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    return {
        groups,
        summaryByCurrency,
        loadDashboard,
        getSummaryForCurrency,
        loading,
    };
}
