import { useCompartidos } from './hooks/use-compartidos';
import RecibidoCard from './components/RecibidoCard';
import EmitidoCard from './components/EmitidoCard';
import PagoCompartidoCard from './components/PagoCompartidoCard';
import AprobarModal from './components/AprobarModal';
import Loader from '@/components/Loader';
import Icon from '@/components/Icon';
import { useState } from 'react';

export default function Compartidos() {
    const {
        compartidos,
        pagos,
        loading,
        loadingAction,
        aprobar,
        rechazar,
        reintentar,
        confirmarPago,
        rechazarPago,
    } = useCompartidos();
    const [section, setSection] = useState('pendientes');
    const [aprobarTarget, setAprobarTarget] = useState(null);

    const recibidosPendientes = compartidos.recibidos.filter(
        (r) => r.status === 'PENDING_APPROVAL',
    );
    const recibidosTerminados = compartidos.recibidos.filter(
        (r) => r.status !== 'PENDING_APPROVAL',
    );
    const enviadosPendientes = compartidos.emitidos.filter(
        (e) => e.copy_status === 'PENDING_APPROVAL',
    );
    const enviadosTerminados = compartidos.emitidos.filter(
        (e) => e.copy_status !== 'PENDING_APPROVAL',
    );

    const handleAprobar = async (entityId, newEntityName) => {
        await aprobar(aprobarTarget.id, entityId, newEntityName);
        setAprobarTarget(null);
    };

    const tabs = [
        {
            key: 'pendientes',
            label: 'Pendientes',
            icon: 'pending_actions',
            count: recibidosPendientes.length + enviadosPendientes.length,
            badgeClass:
                recibidosPendientes.length + enviadosPendientes.length > 0
                    ? 'bg-amber-500 text-white'
                    : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300',
        },
        {
            key: 'pagos',
            label: 'Pagos',
            icon: 'payments',
            count: pagos.porConfirmar.length + pagos.esperando.length,
            badgeClass:
                pagos.porConfirmar.length > 0
                    ? 'bg-amber-500 text-white'
                    : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300',
        },
        {
            key: 'terminados',
            label: 'Terminados',
            icon: 'task_alt',
            count: recibidosTerminados.length + enviadosTerminados.length,
            badgeClass: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300',
        },
    ];

    const enviados = section === 'pendientes' ? enviadosPendientes : enviadosTerminados;
    const recibidos = section === 'pendientes' ? recibidosPendientes : recibidosTerminados;

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
                        <span
                            className={`text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1 ${t.badgeClass}`}
                        >
                            {t.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* CONTENIDO */}
            {section === 'pagos' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <SubSection title="Por confirmar" icon="how_to_reg">
                        {pagos.porConfirmar.map((p) => (
                            <PagoCompartidoCard
                                key={p.movement_id}
                                pago={p}
                                variant="porConfirmar"
                                loadingId={loadingAction}
                                onConfirmar={(id) => confirmarPago(id)}
                                onRechazar={(id) => rechazarPago(id)}
                            />
                        ))}
                    </SubSection>

                    <SubSection title="Esperando confirmación" icon="hourglass_top">
                        {pagos.esperando.map((p) => (
                            <PagoCompartidoCard
                                key={p.movement_id}
                                pago={p}
                                variant="esperando"
                                loadingId={loadingAction}
                            />
                        ))}
                    </SubSection>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <SubSection title="Enviados" icon="send">
                        {enviados.map((item) => (
                            <EmitidoCard
                                key={item.id}
                                item={item}
                                loadingId={loadingAction}
                                onReintentar={(id) => reintentar(id)}
                            />
                        ))}
                    </SubSection>

                    <SubSection title="Recibidos" icon="inbox">
                        {recibidos.map((item) => (
                            <RecibidoCard
                                key={item.id}
                                item={item}
                                loadingId={loadingAction}
                                onAprobar={(g) => setAprobarTarget(g)}
                                onRechazar={(id) => rechazar(id)}
                            />
                        ))}
                    </SubSection>
                </div>
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

function SubSection({ title, icon, children }) {
    const items = Array.isArray(children) ? children.filter(Boolean) : children ? [children] : [];

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-200">
                <Icon name={icon} className="text-base" />
                {title}
                <span className="text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                    {items.length}
                </span>
            </div>

            {items.length === 0 ? (
                <p className="text-sm text-zinc-400 dark:text-zinc-600 pl-6">Nada por acá.</p>
            ) : (
                <div className="flex flex-col gap-3">{children}</div>
            )}
        </div>
    );
}
