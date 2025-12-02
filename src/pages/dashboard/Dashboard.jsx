import { useEffect, useState, useCallback } from 'react';
import Icon from '../../components/Icon';
import StatCards from './components/StatCards';
import CurrencyToggle from './components/CurrencyToggle';
import ActiveExpenses from './components/ActiveExpenses';
import NewExpenseModal from '../../components/modals/NewExpense/NewExpenseCard';
import { agregarDeuda } from '../../services/deudas';
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
            let totalMeDebenARS = 0; // por ahora 0, no tenemos me deben

            entities.forEach((fe) => {
                console.log('Procesando entidad:', fe);
                const gastos = Array.isArray(fe.gastos) ? fe.gastos : [];

                gastos.forEach((g) => {
                    const numQuotas = Number(g.number_of_quotas) || 0;
                    const payedQuotas = Number(g.payed_quotas) || 0;
                    const fixed = Boolean(g.fixed_expense);
                    const amount = Number(g.amount) || 0;
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

                    totalDeboARS += remainingAmount;
                });
            });

            const balanceARS = totalMeDebenARS - totalDeboARS;

            setSummary({
                total_balance_ars: balanceARS,
                total_debo_ars: totalDeboARS,
                total_me_deben_ars: totalMeDebenARS,
            });

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

                            return {
                                id: g.id,
                                purchaseId: g.id,
                                title: g.title || g.name,
                                amount: formattedCuota,
                                total: totalLabel,
                                chip: {
                                    text: 'Debo',
                                    tone: 'red',
                                },
                                progressPct,
                                action: 'Pagar cuota',
                                payed_quotas: payedQuotas,
                                number_of_quotas: numQuotas,
                                currency_type: 1,
                            };
                        });

                    return {
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
                    <StatCards summary={summary} />
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
                    onSave={(payload) => {
                        console.log('Nuevo gasto:', payload);

                        const titulo = payload.name?.trim() || 'Nuevo gasto / deuda';
                        const monto = Number.isFinite(Number(payload.amount))
                            ? Number(payload.amount)
                            : 0;

                        agregarDeuda({
                            titulo,
                            monto,
                            entidad: payload.entity?.trim() || '',
                            moneda: payload.currency || 'ARS',
                            tipo: payload.type,
                            installments: payload.installments,
                        });

                        setOpenNewExpense(false);
                    }}
                />
            )}
        </>
    );
}
