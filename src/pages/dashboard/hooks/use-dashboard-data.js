import { useCallback, useEffect, useState } from 'react';
import { fetchDashboardData } from '@/services/api';
import useAuth from '@/hooks/use-auth';

export function useDashboardData() {
    const { token } = useAuth();

    const [summaryByCurrency, setSummaryByCurrency] = useState(null);
    const [groups, setGroups] = useState([]);

    const loadDashboard = useCallback(async () => {
        if (!token) return;

        try {
            const entities = await fetchDashboardData(token);

            const totals = {
                ARS: { debo: 0, meDeben: 0 },
                USD: { debo: 0, meDeben: 0 },
                EUR: { debo: 0, meDeben: 0 },
            };

            const mappedGroups = entities.map((entity) => {
                const gastos = Array.isArray(entity.gastos) ? entity.gastos : [];

                const items = gastos
                    .filter((g) => {
                        const num = Number(g.number_of_quotas) || 0;
                        const paid = Number(g.payed_quotas) || 0;
                        const fixed = Boolean(g.fixed_expense);

                        if (fixed) return true;
                        if (num > 0) return paid < num;
                        return paid === 0;
                    })
                    .map((g) => {
                        const num = Number(g.number_of_quotas) || 0;
                        const paid = Number(g.payed_quotas) || 0;
                        const amount = Number(g.amount) || 0;

                        const currency =
                            g.currency_type === 2 ? 'USD' : g.currency_type === 3 ? 'EUR' : 'ARS';

                        const amountPerInstallment =
                            num > 0 ? Number(g.amount_per_quota) || amount / num : amount;

                        const remainingInstallments = g.fixed_expense
                            ? paid === 0
                                ? 1
                                : 0
                            : num > 0
                                ? Math.max(num - paid, 0)
                                : paid === 0
                                    ? 1
                                    : 0;

                        const remainingAmount = remainingInstallments * amountPerInstallment;

                        const typeString = (g.type || 'DEBO').toUpperCase();
                        const isMeDeben = typeString === 'ME_DEBEN';

                        if (isMeDeben) {
                            totals[currency].meDeben += remainingAmount;
                        } else {
                            totals[currency].debo += remainingAmount;
                        }
                        return {
                            id: g.id,
                            name: g.title,
                            type: isMeDeben ? 'ME_DEBEN' : 'DEBO',
                            currency,
                            amountPerInstallment,
                            totalAmount: amount,
                            remainingAmount,
                            installments: {
                                paid,
                                total: num,
                            },
                            progress:
                                num > 0
                                    ? Math.min(100, Math.round((paid / num) * 100))
                                    : g.fixed_expense
                                        ? 100
                                        : 0,
                        };
                    });

                if (items.length === 0) return null;

                return {
                    id: entity.id,
                    title: entity.name,
                    items,
                    cta: 'Pagar cuotas',
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
    };
}
