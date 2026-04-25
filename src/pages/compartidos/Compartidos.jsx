import { useCompartidos } from './hooks/use-compartidos';
import RecibidoCard from './components/RecibidoCard';
import EmitidoCard from './components/EmitidoCard';
import AprobarModal from './components/AprobarModal';
import Loader from '@/components/Loader';
import Icon from '@/components/Icon';
import { useState } from 'react';

export default function Compartidos() {
    const { compartidos, loading, loadingAction, aprobar, rechazar, reintentar } = useCompartidos();
    const [section, setSection] = useState('pendientes');
    const [aprobarTarget, setAprobarTarget] = useState(null);

    const pendingItems = compartidos.recibidos.filter((r) => r.status === 'PENDING_APPROVAL');
    const resolvedItems = compartidos.recibidos.filter((r) => r.status !== 'PENDING_APPROVAL');

    const handleAprobar = async (entityId, newEntityName) => {
        await aprobar(aprobarTarget.id, entityId, newEntityName);
        setAprobarTarget(null);
    };

    const tabs = [
        {
            key: 'pendientes',
            label: 'Pendientes',
            icon: 'pending_actions',
            count: pendingItems.length,
            badgeClass: pendingItems.length > 0 ? 'bg-amber-500 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300',
        },
        {
            key: 'recibidos',
            label: 'Recibidos',
            icon: 'inbox',
            count: resolvedItems.length,
            badgeClass: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300',
        },
        {
            key: 'enviados',
            label: 'Enviados',
            icon: 'send',
            count: compartidos.emitidos.length,
            badgeClass: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300',
        },
    ];

    if (loading) return <Loader />;

    return (
        <>
            <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl font-black dark:text-white">Compartidos</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Gastos compartidos con otros usuarios
                </p>
            </div>

            {/* TOGGLE BUTTONS */}
            <div className="inline-flex rounded-xl border border-zinc-200 dark:border-zinc-800 p-1 gap-1 mb-6">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setSection(t.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                            section === t.key
                                ? 'bg-primary/20 text-primary'
                                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                    >
                        <Icon name={t.icon} className="text-base" />
                        {t.label}
                        <span className={`text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1 ${t.badgeClass}`}>
                            {t.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* CONTENIDO */}
            {section === 'pendientes' && (
                <Section emptyIcon="pending_actions" emptyMessage="No tenés solicitudes pendientes">
                    {pendingItems.map((item) => (
                        <RecibidoCard
                            key={item.id}
                            item={item}
                            loadingId={loadingAction}
                            onAprobar={(g) => setAprobarTarget(g)}
                            onRechazar={(id) => rechazar(id)}
                        />
                    ))}
                </Section>
            )}

            {section === 'recibidos' && (
                <Section emptyIcon="inbox" emptyMessage="No tenés gastos recibidos">
                    {resolvedItems.map((item) => (
                        <RecibidoCard
                            key={item.id}
                            item={item}
                            loadingId={loadingAction}
                            onAprobar={(g) => setAprobarTarget(g)}
                            onRechazar={(id) => rechazar(id)}
                        />
                    ))}
                </Section>
            )}

            {section === 'enviados' && (
                <Section emptyIcon="send" emptyMessage="No enviaste gastos compartidos">
                    {compartidos.emitidos.map((item) => (
                        <EmitidoCard
                            key={item.id}
                            item={item}
                            loadingId={loadingAction}
                            onReintentar={(id) => reintentar(id)}
                        />
                    ))}
                </Section>
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

function Section({ emptyIcon, emptyMessage, children }) {
    const items = Array.isArray(children) ? children.filter(Boolean) : children ? [children] : [];

    if (items.length === 0) {
        return (
            <div className="flex items-center gap-2 py-6 text-zinc-400 dark:text-zinc-600 text-sm">
                <Icon name={emptyIcon} className="text-base" />
                {emptyMessage}
            </div>
        );
    }

    return <div className="flex flex-col gap-3">{children}</div>;
}
