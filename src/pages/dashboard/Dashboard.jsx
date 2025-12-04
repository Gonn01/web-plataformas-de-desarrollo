import { useEffect, useState, useCallback, useMemo } from 'react';
import Icon from '../../components/Icon';
import StatCards from './components/StatCards';
import ActiveExpenses from './components/ActiveExpenses';
import NewExpenseModal from '../../components/modals/NewExpense/NewExpenseCard';
import { fetchDashboardData } from '@/services/api';
import useAuth from '@/hooks/use-auth';

export default function Dashboard() {
    const [currency, setCurrency] = useState('ARS');
    const [query, setQuery] = useState('');
    const [openNewExpense, setOpenNewExpense] = useState(false);
    const [summaryByCurrency, setSummaryByCurrency] = useState(null);
    const [groups, setGroups] = useState([]);

    const auth = useAuth();

    const loadDashboard = useCallback(async () => {
        if (!auth?.token) return;

        try {
            const entities = await fetchDashboardData(auth.token);

            // Totales por moneda
            const totals = {
                ARS: { debo: 0, meDeben: 0 },
                USD: { debo: 0, meDeben: 0 },
                EUR: { debo: 0, meDeben: 0 },
            };

            const mappedGroups = entities
                .map((fe) => {
                    const gastos = Array.isArray(fe.gastos) ? fe.gastos : [];

                    const items = gastos
                        .filter((g) => {
                            const numQuotas = Number(g.number_of_quotas) || 0;
                            const payedQuotas = Number(g.payed_quotas) || 0;
                            const fixed = Boolean(g.fixed_expense);

                            if (fixed) {
                                return payedQuotas === 0;
                            }

                            if (numQuotas > 0) {
                                return payedQuotas < numQuotas;
                            }

                            return payedQuotas === 0;
                        })
                        .map((g) => {
                            const numQuotas = Number(g.number_of_quotas) || 0;
                            const payedQuotas = Number(g.payed_quotas) || 0;
                            const amount = Number(g.amount) || 0;

                            const rawCurrencyType = Number(g.currency_type) || 1;
                            const currencyLabel =
                                rawCurrencyType === 2
                                    ? 'USD'
                                    : rawCurrencyType === 3
                                        ? 'EUR'
                                        : 'ARS';
                            const amountPerQuota =
                                numQuotas > 0
                                    ? Number(g.amount_per_quota) || amount / numQuotas
                                    : amount;

                            const rawType = (g.type || 'DEBO').toString().toLowerCase();
                            const isMeDeben = rawType === 'me_deben' || rawType === 'me deben';

                            // Cuántas cuotas quedan / monto restante
                            let remainingQuotas;

                            if (g.fixed_expense) {
                                remainingQuotas = payedQuotas === 0 ? 1 : 0;
                            } else if (numQuotas === 0) {
                                remainingQuotas = payedQuotas === 0 ? 1 : 0;
                            } else {
                                remainingQuotas = Math.max(numQuotas - payedQuotas, 0);
                            }

                            const remainingAmount = remainingQuotas * amountPerQuota;

                            // Sumamos a totales por moneda
                            if (isMeDeben) {
                                totals[currencyLabel].meDeben += remainingAmount;
                            } else {
                                totals[currencyLabel].debo += remainingAmount;
                            }

                            const progressPct =
                                numQuotas > 0
                                    ? Math.min(100, Math.round((payedQuotas / numQuotas) * 100))
                                    : g.fixed_expense
                                        ? 100
                                        : 0;

                            const formattedCuota = `${currencyLabel} $${amountPerQuota.toLocaleString(
                                'es-AR',
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                },
                            )}`;

                            const totalLabel = numQuotas
                                ? `de ${currencyLabel} $${amount.toLocaleString('es-AR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })} · ${payedQuotas}/${numQuotas} cuotas`
                                : `Total ${currencyLabel} $${amount.toLocaleString('es-AR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}${g.fixed_expense ? ' · gasto fijo' : ''}`;

                            return {
                                id: g.id,
                                purchaseId: g.id,
                                title: g.title || g.name,
                                amount: formattedCuota,
                                total: totalLabel,
                                chip: {
                                    text: isMeDeben ? 'Me deben' : 'Debo',
                                    tone: isMeDeben ? 'green' : 'red',
                                },
                                progressPct,
                                action: isMeDeben ? 'Registrar cobro' : 'Pagar cuota',
                                payed_quotas: payedQuotas,
                                number_of_quotas: numQuotas,
                                currency_type: rawCurrencyType,
                                currency_label: currencyLabel,
                            };
                        });

                    if (items.length === 0) {
                        return null;
                    }

                    return {
                        id: fe.id,
                        title: fe.name,
                        cta: 'Pagar cuotas',
                        items,
                    };
                })
                .filter(Boolean);

            const summaryByCurrencyComputed = ['ARS', 'USD', 'EUR'].reduce((acc, cur) => {
                const deb = totals[cur].debo;
                const md = totals[cur].meDeben;
                acc[cur] = {
                    total_debo: deb,
                    total_me_deben: md,
                    total_balance: md - deb,
                };
                return acc;
            }, {});

            setSummaryByCurrency(summaryByCurrencyComputed);
            setGroups(mappedGroups);
        } catch (err) {
            console.error('Error al cargar dashboard:', err);
        }
    }, [auth?.token]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const summary = useMemo(() => {
        if (!summaryByCurrency) return null;
        return summaryByCurrency[currency] || null;
    }, [summaryByCurrency, currency]);

    const handleSaveExpense = useCallback(
        async (payload) => {
            try {
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

                const {
                    type,
                    name,
                    financial_entity_id,
                    amount,
                    currency_type,
                    is_fixed_expense,
                    is_installment,
                    installments,
                } = payload;

                const normalizedType =
                    (type || '').toLowerCase() === 'me deben' ? 'ME_DEBEN' : 'DEBO';

                const body = {
                    financial_entity_id,
                    name,
                    amount,
                    number_of_quotas: is_installment ? Number(installments) || 0 : 0,
                    currency_type,
                    first_quota_date: null,
                    fixed_expense: is_fixed_expense,
                    image: null,
                    type: normalizedType,
                };

                console.log('Crear Gasto - body enviado al backend:', body);

                const res = await fetch(`${baseUrl}/dashboard/gastos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}),
                    },
                    body: JSON.stringify(body),
                });

                if (!res.ok) {
                    const errText = await res.text();
                    console.error('Error creando gasto:', errText);
                    alert('No se pudo crear el gasto.');
                    return;
                }

                setOpenNewExpense(false);
                await loadDashboard();
            } catch (error) {
                console.error('Error inesperado creando gasto:', error);
                alert('Ocurrió un error al crear el gasto.');
            }
        },
        [auth?.token, loadDashboard],
    );

    return (
        <>
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between mb-4">
                <div className="flex min-w-72 flex-col gap-2">
                    <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                        Dashboard
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal">
                        Un resumen de tus finanzas personales.
                    </p>
                </div>
                <button
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-primary text-background-dark text-sm font-bold tracking-[0.015em] hover:bg-primary/90 transition-colors"
                    onClick={() => setOpenNewExpense(true)}
                >
                    <Icon name="add_circle" className="mr-2 text-lg" />
                    <span className="truncate">Crear Gasto / Deuda</span>
                </button>
            </div>

            {/* BALANCE HORIZONTAL ARRIBA */}
            <StatCards summary={summary} currency={currency} />

            {/* GASTOS ACTIVOS */}
            <div className="mt-6">
                <ActiveExpenses
                    query={query}
                    groups={groups}
                    token={auth?.token}
                    currency={currency}
                    onCurrencyChange={setCurrency}
                    onQueryChange={setQuery}
                    onPaid={loadDashboard}
                />
            </div>

            {/* Modal nuevo gasto */}
            {openNewExpense && (
                <NewExpenseModal
                    onClose={() => setOpenNewExpense(false)}
                    onSave={handleSaveExpense}
                />
            )}
        </>
    );
}
