import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Icon from '../dashboard/components/Icon';
import NewExpenseModal from '../dashboard/components/modals/NewExpenseCard';
import { fetchFinancialEntityById } from '@/services/api';
import useAuth from '@/hooks/use-auth';
import { ListContainer } from './components/ListContainer';
import { GastoFinalizadoItem } from './components/GastoFinalizadoItem';
import { GastoItem } from './components/GastoItem';
import { TabHeader } from './components/TabHeader';
import { StatCard } from './components/StatCard';

export default function EntidadDetalle() {
    const { id } = useParams();
    const { token } = useAuth();

    const [tab, setTab] = useState('activos');
    const [openNewExpense, setOpenNewExpense] = useState(false);
    const [entity, setEntity] = useState(null);
    const [loading, setLoading] = useState(true);

    /** =============================
     *  FETCH DATA
     *  ============================= */
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await fetchFinancialEntityById(id, token);
                setEntity(data);
            } catch (err) {
                console.error('Error loading entity:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, token]);

    /** =============================
     *  PROCESAR ESTADÍSTICAS (HOOK ANTES DE RETORNS)
     *  ============================= */
    const stats = useMemo(() => {
        if (!entity) return { ars: 0, usd: 0, debts: 0 };

        const activos = entity.gastos_activos || [];
        const finalizados = entity.gastos_inactivos || [];

        let ars = 0;
        let usd = 0;

        const acumular = (gasto) => {
            if (gasto.currency_type === '1') ars += Number(gasto.amount);
            if (gasto.currency_type === '2') usd += Number(gasto.amount);
        };

        activos.forEach(acumular);
        finalizados.forEach(acumular);

        return {
            ars,
            usd,
            debts: activos.length,
        };
    }, [entity]);

    /** =============================
     *  AHORA SÍ LOS RETURNS CONDICIONALES
     *  ============================= */
    if (loading) {
        return (
            <div className="py-10 text-center text-zinc-500 dark:text-zinc-400">
                Cargando entidad financiera...
            </div>
        );
    }

    if (!entity) {
        return <div className="py-10 text-center text-red-500">Entidad no encontrada.</div>;
    }

    const activos = entity.gastos_activos || [];
    const finalizados = entity.gastos_inactivos || [];
    const logs = entity.logs || [];

    return (
        <>
            {/* Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
                    {entity.name}
                </h1>
                <button
                    className="flex h-10 min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary/20 px-4 text-sm font-bold text-primary hover:bg-primary/30"
                    onClick={() => setOpenNewExpense(true)}
                >
                    <Icon name="add" className="text-base" />
                    <span>Agregar Gasto</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                <StatCard label="Balance Total (ARS)" value={stats.ars} currency="ARS" />
                <StatCard label="Balance Total (USD)" value={stats.usd} currency="USD" />
                <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        Deudas Activas
                    </p>
                    <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        {stats.debts}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-col">
                <TabHeader tab={tab} setTab={setTab} />

                {/* GASTOS ACTIVOS */}
                {tab === 'activos' && (
                    <ListContainer empty={activos.length === 0} emptyLabel="Sin gastos activos.">
                        {activos.map((g, i) => (
                            <GastoItem key={i} gasto={g} />
                        ))}
                    </ListContainer>
                )}

                {/* GASTOS FINALIZADOS */}
                {tab === 'finalizados' && (
                    <ListContainer
                        empty={finalizados.length === 0}
                        emptyLabel="Sin gastos finalizados."
                    >
                        {finalizados.map((g, i) => (
                            <GastoFinalizadoItem key={i} gasto={g} />
                        ))}
                    </ListContainer>
                )}

                {/* LOG DE CAMBIOS */}
                {tab === 'log' && (
                    <ListContainer empty={logs.length === 0} emptyLabel="Sin registros de cambios.">
                        {logs.map((l, i) => (
                            <div key={i} className="flex items-center justify-between py-3">
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    {l.content}
                                </p>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {new Date(l.created_at).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </ListContainer>
                )}
            </div>

            {/* Modal */}
            {openNewExpense && (
                <NewExpenseModal
                    onClose={() => setOpenNewExpense(false)}
                    onSave={(payload) => {
                        console.log('Nuevo gasto:', payload);
                        setOpenNewExpense(false);
                    }}
                />
            )}
        </>
    );
}
