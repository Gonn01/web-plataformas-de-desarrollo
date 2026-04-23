import { useState } from 'react';
import { useCompartidos } from './hooks/use-compartidos';
import RecibidoCard from './components/RecibidoCard';
import EmitidoCard from './components/EmitidoCard';
import AprobarModal from './components/AprobarModal';
import Loader from '@/components/Loader';
import Icon from '@/components/Icon';

export default function Compartidos() {
    const { compartidos, loading, loadingAction, aprobar, rechazar, reintentar } = useCompartidos();

    const [tab, setTab] = useState('recibidos');
    const [aprobarTarget, setAprobarTarget] = useState(null);

    const pendingCount = compartidos.recibidos.filter((r) => r.status === 'PENDING_APPROVAL').length;

    const handleAprobar = async (entityId, newEntityName) => {
        await aprobar(aprobarTarget.id, entityId, newEntityName);
        setAprobarTarget(null);
    };

    const tabBase =
        'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors';
    const tabActive = 'bg-primary/20 text-primary';
    const tabIdle =
        'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800';

    return (
        <>
            <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl font-black dark:text-white">Compartidos</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Gastos compartidos con otros usuarios
                </p>
            </div>

            {/* TABS */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setTab('recibidos')}
                    className={`${tabBase} ${tab === 'recibidos' ? tabActive : tabIdle}`}
                >
                    <Icon name="inbox" className="text-base" />
                    Recibidos
                    {pendingCount > 0 && (
                        <span className="bg-primary text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                            {pendingCount}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setTab('emitidos')}
                    className={`${tabBase} ${tab === 'emitidos' ? tabActive : tabIdle}`}
                >
                    <Icon name="send" className="text-base" />
                    Emitidos
                    {compartidos.emitidos.length > 0 && (
                        <span className="bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                            {compartidos.emitidos.length}
                        </span>
                    )}
                </button>
            </div>

            {loading ? (
                <Loader />
            ) : (
                <>
                    {tab === 'recibidos' && (
                        <div className="flex flex-col gap-3">
                            {compartidos.recibidos.length === 0 ? (
                                <EmptyState
                                    icon="inbox"
                                    message="No tenés gastos recibidos"
                                />
                            ) : (
                                compartidos.recibidos.map((item) => (
                                    <RecibidoCard
                                        key={item.id}
                                        item={item}
                                        loadingId={loadingAction}
                                        onAprobar={(g) => setAprobarTarget(g)}
                                        onRechazar={(id) => rechazar(id)}
                                    />
                                ))
                            )}
                        </div>
                    )}

                    {tab === 'emitidos' && (
                        <div className="flex flex-col gap-3">
                            {compartidos.emitidos.length === 0 ? (
                                <EmptyState
                                    icon="send"
                                    message="No enviaste gastos compartidos"
                                />
                            ) : (
                                compartidos.emitidos.map((item) => (
                                    <EmitidoCard
                                        key={item.id}
                                        item={item}
                                        loadingId={loadingAction}
                                        onReintentar={(id) => reintentar(id)}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </>
            )}

            {aprobarTarget && (
                <AprobarModal
                    open={true}
                    gasto={aprobarTarget}
                    loading={loadingAction === aprobarTarget.id}
                    onClose={() => setAprobarTarget(null)}
                    onConfirm={handleAprobar}
                />
            )}
        </>
    );
}

function EmptyState({ icon, message }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400 dark:text-zinc-600">
            <Icon name={icon} className="text-5xl mb-3" />
            <p className="text-sm">{message}</p>
        </div>
    );
}
