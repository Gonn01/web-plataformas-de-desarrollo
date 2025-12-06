import { useEffect, useMemo, useState } from 'react';
import useAuth from '@/hooks/use-auth';
import {
    fetchFinancialEntityById,
    createExpense,
    updateFinancialEntity,
    deleteFinancialEntity,
} from '@/services/api';

import { TabHeader } from './components/TabHeader';
import { ListContainer } from './components/ListContainer';
import { GastoItem } from './components/GastoItem';
import { GastoFinalizadoItem } from './components/GastoFinalizadoItem';
import { StatCard } from './components/StatCard';
import EditEntityModal from './components/EditEntityModal';
import NewExpenseModal from '../../components/modals/NewExpense/NewExpenseCard';
import Icon from '../../components/Icon';
import { useParams } from 'react-router-dom';

export default function EntidadDetalle() {
    const { id } = useParams();
    const { token } = useAuth();

    const [entity, setEntity] = useState(null);
    const [tab, setTab] = useState('activos'); // ⬅️ luego agregamos "fijos"
    const [openNewExpense, setOpenNewExpense] = useState(false);
    const [openEditEntity, setOpenEditEntity] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchFinancialEntityById(id, token);

                console.log("DATA COMPLETA ENTIDAD:", data); // 🟩 DEBUG PARA LOG

                // 🔥 FIX LOG — si viene null, lo forzamos a []
                data.logs = Array.isArray(data.logs) ? data.logs : [];

                setEntity(data);
            } catch (err) {
                console.error('Error cargando entidad', err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id, token]);

    // ================= STATS ===================
    const stats = useMemo(() => {
        if (!entity) return { ars: 0, usd: 0, debts: 0 };

        let ars = 0;
        let usd = 0;

        const sumar = (g) => {
            const amount = Number(g.amount || 0);
            if (g.currency_type === '1') ars += amount;
            if (g.currency_type === '2') usd += amount;
        };

        entity.gastos_activos.forEach(sumar);
        entity.gastos_inactivos.forEach(sumar);

        return {
            ars,
            usd,
            debts: entity.gastos_activos.length,
        };
    }, [entity]);

    // ============ LOADING ============
    if (loading) {
        return <div className="text-center p-10 text-zinc-500">Cargando entidad...</div>;
    }

    if (!entity) {
        return <div className="text-center p-10 text-red-500">Entidad no encontrada</div>;
    }

    // ============================
    // CLASIFICACIÓN DE GASTOS 👇
    // ============================

    const activos = entity.gastos_activos;

    const finalizados = entity.gastos_inactivos;

    // ⭐ NUEVO: detección de GASTOS FIJOS
    // Ajustá "is_fixed" si tu backend usa otro campo
    const fijos = [
        ...entity.gastos_activos.filter((g) => g.is_fixed === true),
        ...entity.gastos_inactivos.filter((g) => g.is_fixed === true),
    ];

    // ⛔ Evitar que los fijos aparezcan doble
    const activos_limpios = activos.filter((g) => !g.is_fixed);
    const finalizados_limpios = finalizados.filter((g) => !g.is_fixed);

    const logs = entity.logs ?? [];

    return (
        <>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between mb-6">
                <h1 className="text-3xl sm:text-4xl font-black dark:text-white">{entity.name}</h1>

                <button
                    className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 px-4 py-2 rounded-lg text-primary font-bold"
                    onClick={() => setOpenEditEntity(true)}
                >
                    <Icon name="edit" /> Editar Entidad
                </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <StatCard label="Balance Total (ARS)" value={stats.ars} currency="ARS" />
                <StatCard label="Balance Total (USD)" value={stats.usd} currency="USD" />
                <StatCard label="Deudas Activas" value={stats.debts} />
            </div>

            {/* ⭐ ACTUALIZAMOS LOS TABS PARA INCLUIR GASTOS FIJOS */}
            <TabHeader tab={tab} setTab={setTab} includeFijos />

            {/* ACTIVOS */}
            {tab === 'activos' && (
                <ListContainer empty={activos_limpios.length === 0} emptyLabel="Sin gastos activos.">
                    {activos_limpios.map((gasto, i) => (
                        <GastoItem key={i} gasto={gasto} />
                    ))}
                </ListContainer>
            )}

            {/* FINALIZADOS */}
            {tab === 'finalizados' && (
                <ListContainer
                    empty={finalizados_limpios.length === 0}
                    emptyLabel="Sin gastos finalizados."
                >
                    {finalizados_limpios.map((gasto, i) => (
                        <GastoFinalizadoItem key={i} gasto={gasto} />
                    ))}
                </ListContainer>
            )}

            {/* ⭐ NUEVO TAB: GASTOS FIJOS */}
            {tab === 'fijos' && (
                <ListContainer empty={fijos.length === 0} emptyLabel="Sin gastos fijos.">
                    {fijos.map((gasto, i) => (
                        <GastoItem key={i} gasto={gasto} isFixed />
                    ))}
                </ListContainer>
            )}

            {/* LOG */}
            {tab === 'log' && (
                <ListContainer empty={logs.length === 0} emptyLabel="Sin registros.">
                    {logs.map((l, i) => (
                        <div key={i} className="flex justify-between py-3">
                            <p className="text-sm text-zinc-300">{l.content}</p>
                            <span className="text-xs text-zinc-500">
                                {new Date(l.created_at).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </ListContainer>
            )}

            {/* MODALES */}
            {openEditEntity && (
                <EditEntityModal
                    open={openEditEntity}
                    entity={entity}
                    onClose={() => setOpenEditEntity(false)}
                    onSave={async (newName) => {
                        try {
                            await updateFinancialEntity(entity.id, newName, token);
                            setEntity((prev) => ({ ...prev, name: newName }));
                            setOpenEditEntity(false);
                        } catch (err) {
                            console.error('Error actualizando entidad', err);
                        }
                    }}
                    onDelete={async () => {
                        try {
                            await deleteFinancialEntity(entity.id, token);
                            window.location.href = '/app/entidades';
                        } catch (err) {
                            console.error('Error eliminando entidad', err);
                        }
                    }}
                />
            )}

            {openNewExpense && (
                <NewExpenseModal
                    defaultEntityId={entity.id}
                    onClose={() => setOpenNewExpense(false)}
                    onSave={async (payload) => {
                        try {
                            await createExpense(payload, token);
                            window.location.href = '/app/entidades';
                        } catch (err) {
                            console.error('Error guardando gasto', err);
                        }
                    }}
                />
            )}
        </>
    );
}
