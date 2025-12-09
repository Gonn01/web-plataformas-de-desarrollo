import Icon from '../../components/Icon';
import StatCards from './components/StatCards';
import ActiveExpenses from './components/ActiveExpenses';
import NewExpenseModal from '../../components/modals/Expenses/NewExpense/NewExpenseModal';
import { useDashboardUI } from './hooks/use-dashboard-ui';
import { useDashboardData } from './hooks/use-dashboard-data';
import { useNewExpense } from './hooks/use-new-expense';
import Loader from '@/components/Loader';

export default function Dashboard() {
    const ui = useDashboardUI();
    const data = useDashboardData();
    const { saveExpense } = useNewExpense(data.loadDashboard, () => ui.setOpenNewExpense(false));

    const summary = data.getSummaryForCurrency(ui.currency);

    if (data.loading) {
        return <Loader />;
    }

    return (
        <>
            {/* HEADER */}
            <div className="flex justify-between mb-4">
                <div>
                    <p className="text-4xl font-black text-slate-900 dark:text-white">Dashboard</p>
                    <p className="text-slate-500 dark:text-slate-400">
                        Un resumen de tus finanzas personales.
                    </p>
                </div>

                <button
                    onClick={() => ui.setOpenNewExpense(true)}
                    className="flex items-center h-11 px-5 rounded-lg bg-primary text-background-dark font-bold"
                >
                    <Icon name="add_circle" className="mr-2" />
                    Crear Gasto / Deuda
                </button>
            </div>

            {/* BALANCE */}
            <StatCards summary={summary} currency={ui.currency} />

            {/* LISTA DE GASTOS ACTIVOS */}
            <ActiveExpenses
                query={ui.query}
                groups={data.groups}
                currency={ui.currency}
                onCurrencyChange={ui.setCurrency}
                onQueryChange={ui.setQuery}
                token={null}
                onPaid={data.loadDashboard}
            />

            {/* MODAL */}
            {ui.openNewExpense && (
                <NewExpenseModal onClose={() => ui.setOpenNewExpense(false)} onSave={saveExpense} />
            )}
        </>
    );
}
