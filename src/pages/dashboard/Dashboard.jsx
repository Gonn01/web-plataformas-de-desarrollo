import { useEffect, useState, useCallback } from 'react';
import Icon from '../../components/Icon';
import StatCards from './components/StatCards';
import CurrencyToggle from './components/CurrencyToggle';
import ActiveExpenses from './components/ActiveExpenses';
import NewExpenseModal from '../../components/modals/NewExpense/NewExpenseCard';
import { fetchDashboardData } from '@/services/api';
import useAuth from '@/hooks/use-auth';

export default function Dashboard() {
    const [currency, setCurrency] = useState('ARS');
    const [query, setQuery] = useState('');
    const [openNewExpense, setOpenNewExpense] = useState(false);

    const [summary, setSummary] = useState(null);
    const [groups, setGroups] = useState([]);

    const auth = useAuth();

    const loadDashboard = useCallback(async () => {
        if (!auth?.token) return;

        try {
            const entities = await fetchDashboardData(auth.token);

            // === SUMMARY (StatCards) ===
            let totalDeboARS = 0;
            let totalMeDebenARS = 0;

            entities.forEach((fe) => {
                const gastos = Array.isArray(fe.gastos) ? fe.gastos : [];

                gastos.forEach((g) => {
                    const numQuotas = Number(g.number_of_quotas) || 0;
                    const payedQuotas = Number(g.payed_quotas) || 0;
                    const fixed = Boolean(g.fixed_expense);
                    const amount = Number(g.amount) || 0;
                    const rawType = (g.type || 'debo').toString().toLowerCase();
                    const isActive = fixed || numQuotas === 0 || payedQuotas < numQuotas;
                    if (!isActive) return;

                    const amountPerQuota = numQuotas > 0 ? amount / numQuotas : amount;

                    let remainingQuotas;
                    if (fixed) {
                        remainingQuotas = 1;
                    } else {
                        remainingQuotas = Math.max(numQuotas - payedQuotas, 0);
                    }

                    const remainingAmount = remainingQuotas * amountPerQuota;

                    const isMeDeben =
                        rawType === 'me_deben' || rawType === 'me deben' || rawType === 'me-deben';

                    if (isMeDeben) {
                        totalMeDebenARS += remainingAmount;
                    } else {
                        totalDeboARS += remainingAmount;
                    }
                });
            });

            const balanceARS = totalMeDebenARS - totalDeboARS;

            setSummary({
                total_balance_ars: balanceARS,
                total_debo_ars: totalDeboARS,
                total_me_deben_ars: totalMeDebenARS,
            });

            // === GROUPS (ActiveExpenses) ===
            const mappedGroups = entities
                .map((fe) => {
                    const gastos = Array.isArray(fe.gastos) ? fe.gastos : [];

                    const items = gastos
                        .filter((g) => {
                            const numQuotas = Number(g.number_of_quotas) || 0;
                            const payedQuotas = Number(g.payed_quotas) || 0;
                            const fixed = Boolean(g.fixed_expense);
                            return fixed || numQuotas === 0 || payedQuotas < numQuotas;
                        })
                        .map((g) => {
                            const numQuotas = Number(g.number_of_quotas) || 0;
                            const payedQuotas = Number(g.payed_quotas) || 0;
                            const amount = Number(g.amount) || 0;
                            const amountPerQuota = numQuotas > 0 ? amount / numQuotas : amount;
                            const currencyLabel = 'ARS';

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

                            let progressPct = 0;
                            if (numQuotas > 0) {
                                progressPct = Math.min(
                                    100,
                                    Math.round((payedQuotas / numQuotas) * 100),
                                );
                            } else if (g.fixed_expense) {
                                progressPct = 50;
                            }

                            const rawType = (g.type || 'debo').toString().toLowerCase();
                            const isMeDeben =
                                rawType === 'me_deben' ||
                                rawType === 'me deben' ||
                                rawType === 'me-deben';

                            const chipText = isMeDeben ? 'Me deben' : 'Debo';
                            const chipTone = isMeDeben ? 'green' : 'red';

                            return {
                                id: g.id,
                                purchaseId: g.id,
                                title: g.title || g.name,
                                amount: formattedCuota,
                                total: totalLabel,
                                chip: {
                                    text: chipText,
                                    tone: chipTone,
                                },
                                progressPct,
                                action: isMeDeben ? 'Registrar cobro' : 'Pagar cuota',
                                payed_quotas: payedQuotas,
                                number_of_quotas: numQuotas,
                                currency_type: 1,
                                type: rawType,
                            };
                        });

                    return {
                        id: fe.id,
                        title: fe.name,
                        cta: 'Pagar cuotas',
                        items,
                    };
                })
                .filter((g) => g.items.length > 0);

            setGroups(mappedGroups);
        } catch (err) {
            console.error('Error al cargar dashboard:', err);
        }
    }, [auth?.token]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    return (
        <>
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
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

            {/* Grid principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mt-8">
                {/* Columna izquierda */}
                <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
                    <StatCards summary={summary} currency={currency} />
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold pt-4">
                        Resumen Mensual
                    </h3>
                    <CurrencyToggle currency={currency} onChange={setCurrency} />
                </div>

                {/* Gastos activos */}
                <ActiveExpenses
                    query={query}
                    groups={groups}
                    token={auth?.token}
                    onQueryChange={setQuery}
                    onPaid={loadDashboard}
                />
            </div>

            {/* Modal nuevo gasto (por ahora sigue usando localstorage) */}
            {openNewExpense && (
                <NewExpenseModal
                    onClose={() => setOpenNewExpense(false)}
                    onSave={async (payload) => {
                        try {
                            console.log('Nuevo gasto (payload modal):', payload);
                            const baseUrl =
                                import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
                            const currencyTypeMap = {
                                ARS: 1,
                                USD: 2,
                            };
                            const currency_type = currencyTypeMap[payload.currency] || 1;
                            const rawType = (payload.type || 'Debo').toString().toLowerCase();
                            const type =
                                rawType.includes('me') && rawType.includes('deben')
                                    ? 'me_deben'
                                    : 'debo';
                            const number_of_quotas = Number(payload.installments) || 0;
                            const fixed_expense = number_of_quotas === 0;

                            const body = {
                                financial_entity_id: payload.financial_entity_id,
                                name: payload.name,
                                amount: Number(payload.amount),
                                number_of_quotas,
                                currency_type,
                                first_quota_date: null,
                                fixed_expense,
                                image: null,
                                type,
                            };

                            const res = await fetch(`${baseUrl}/dashboard/gastos`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    ...(auth?.token
                                        ? { Authorization: `Bearer ${auth.token}` }
                                        : {}),
                                },
                                body: JSON.stringify(body),
                            });
                            if (!res.ok) {
                                const errorText = await res.text();
                                console.error('Error al crear gasto:', errorText);
                                alert('No se pudo crear el gasto.');
                                return;
                            }
                            setOpenNewExpense(false);
                            await loadDashboard();
                        } catch (err) {
                            console.error('Error inesperado al crear gasto:', err);
                            alert('Ocurrió un error al crear el gasto.');
                        }
                    }}
                />
            )}
        </>
    );
}
