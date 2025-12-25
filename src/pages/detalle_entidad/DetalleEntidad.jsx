import Icon from '../../components/Icon';
import NewExpenseModal from '../../components/modals/Expenses/NewExpense/NewExpenseModal';

import { TabHeader } from './components/TabHeader';
import { ListContainer } from './components/ListContainer';
import GastoItem from './components/GastoItem';
import { StatCard } from './components/StatCard';
import EditEntityModal from './components/EditEntityModal';

import { useEntidadUI } from './hooks/use-entidad-ui';
import Loader from '@/components/Loader';
import PeligroEliminar from '@/components/PeligroEliminar';

export default function EntidadDetalle() {
    const {
        entity,
        stats,
        loading,
        tab,
        setTab,
        openNewExpense,
        setOpenNewExpense,
        openEditEntity,
        setOpenEditEntity,
        onCreateExpense,
        loadingCreatingExpense,
        onUpdateEntity,
        // loadingUpdatingEntity,
        navigate,
        onDeleteEntity,
    } = useEntidadUI();

    if (loading) return <Loader />;

    if (!entity) {
        return <div className="text-center p-10 text-red-500">Entidad no encontrada</div>;
    }

    return (
        <>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between mb-6">
                <h1 className="text-3xl sm:text-4xl font-black dark:text-white">{entity.name}</h1>
                <div className="flex">
                    <button
                        className="flex me-3 items-center gap-2 bg-primary/20 hover:bg-primary/30 px-4 py-2 rounded-lg text-primary font-bold cursor-pointer"
                        onClick={() => setOpenNewExpense(true)}
                    >
                        <Icon name="add" /> Crear Gasto
                    </button>
                    <button
                        className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 px-4 py-2 rounded-lg text-primary font-bold cursor-pointer"
                        onClick={() => setOpenEditEntity(true)}
                    >
                        <Icon name="edit" /> Editar Entidad
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {/* <StatCard label="Balance Total" value={stats.amount} currency="ARS" /> */}
                <StatCard
                    label="Gastos activos"
                    value={stats.debts}
                    onClick={() => setTab('activos')}
                />
                <StatCard
                    label="Gastos finalizados"
                    value={stats.finalized}
                    onClick={() => setTab('finalizados')}
                />
            </div>

            {/* Tabs */}
            <TabHeader tab={tab} setTab={setTab} />

            {/* LISTAS */}
            {tab === 'activos' && (
                <ListContainer
                    empty={entity.gastos_activos.length === 0}
                    emptyLabel="Sin gastos activos."
                >
                    {entity.gastos_activos.map((g) => (
                        <GastoItem
                            key={g.id}
                            gasto={g}
                            variant="activo"
                            onClick={() => navigate(`/app/gastos/${g.id}`)}
                        />
                    ))}
                </ListContainer>
            )}

            {tab === 'finalizados' && (
                <ListContainer
                    empty={entity.gastos_inactivos.length === 0}
                    emptyLabel="Sin gastos finalizados."
                >
                    {entity.gastos_inactivos.map((g) => (
                        <GastoItem
                            key={g.id}
                            gasto={g}
                            variant="finalizado"
                            onClick={() => navigate(`/app/gastos/${g.id}`)}
                        />
                    ))}
                </ListContainer>
            )}

            {tab === 'log' && (
                <ListContainer empty={entity.logs.length === 0} emptyLabel="Sin registros.">
                    {entity.logs.map((l, i) => (
                        <div key={i} className="flex justify-between py-3">
                            <p className="text-sm text-zinc-600">{l.content}</p>
                            <span className="text-xs text-zinc-500">
                                {new Date(l.created_at).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </ListContainer>
            )}
            <PeligroEliminar label="Eliminar Entidad" onDelete={onDeleteEntity} />
            {/* MODAL EDITAR */}
            {openEditEntity && (
                <EditEntityModal
                    open={openEditEntity}
                    entity={entity}
                    onClose={() => setOpenEditEntity(false)}
                    onSave={onUpdateEntity}
                    saving={loadingCreatingExpense}
                />
            )}

            {/* MODAL NUEVO GASTO */}
            {openNewExpense && (
                <NewExpenseModal
                    defaultEntityId={entity.id}
                    onClose={() => setOpenNewExpense(false)}
                    onSave={onCreateExpense}
                    saving={true}
                />
            )}
        </>
    );
}
