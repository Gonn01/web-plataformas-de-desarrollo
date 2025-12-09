import EntityIcon from '../../../components/EntityIcon';
import BalancePill from '../../dashboard/components/BalancePill';

export default function EntityCard({ entity, onClick, onDelete }) {
    return (
        <div className="w-full flex gap-4 bg-white dark:bg-slate-800/50 p-4 rounded-xl items-center justify-between shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:dark:bg-slate-800 transition-all">

            {/* === SECCIÓN IZQUIERDA (ICONO + INFO) === */}
            <button
                onClick={() => onClick?.(entity)}
                className="text-left flex-1 flex items-center gap-4 cursor-pointer"
            >
                <EntityIcon type={entity.type} />

                <div className="flex flex-col flex-1 justify-center">
                    <p className="text-slate-900 dark:text-white text-base font-bold leading-normal">
                        {entity.name}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:gap-4">
                        {entity.balances?.map((b) => (
                            <BalancePill
                                key={`${entity.id}-${b.currency}`}
                                amount={b.amount}
                                currency={b.currency}
                            />
                        ))}
                    </div>

                    <p className="mt-1 text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">
                        {entity.activeExpenses} gasto
                        {entity.activeExpenses === 1 ? ' activo' : 's activos'}
                    </p>
                </div>
            </button>

            {/* === SECCIÓN DERECHA (flecha + botón eliminar) === */}
            <div className="flex flex-col items-end gap-2">

                {/* FLECHITA → ver detalle */}
                <button
                    onClick={() => onClick?.(entity)}
                    className="text-slate-400 dark:text-slate-500 flex size-7 items-center justify-center hover:text-primary transition"
                >
                    <span className="material-symbols-outlined text-2xl">chevron_right</span>
                </button>

                {/* 🟥 BOTÓN ELIMINAR — solo si viene la prop */}
                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(entity);
                        }}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold transition-all">
                        Eliminar
                    </button>
                )}
            </div>
        </div>
    );
}
