import { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

function Icon({ name, className = '' }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

function formatMoney(amount, currency) {
    try {
        // AR locale por defecto; si querés, podés pasarlo por prop
        const f = new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        return f.format(amount);
    } catch {
        return `${currency} $${amount}`;
    }
}

/**
 * Modal de confirmación de pago de cuotas
 *
 * Props:
 * - open: boolean
 * - onCancel: () => void
 * - onConfirm: () => void
 * - entityName: string (p.ej.: "Banco Nación")
 * - items: Array<{
 *     id: string|number,
 *     title: string,               // "Pago Tarjeta", "Alquiler Dpto.", etc.
 *     type: 'debo'|'me_deben',     // define badge rojo/verde
 *     currency: 'ARS'|'USD'|'EUR',
 *     amountToPay: number,         // monto de ESTA cuota a registrar
 *     totalAmount?: number,        // monto total del gasto (opcional)
 *     paidInstallments?: number,   // cuotas pagadas (opcional)
 *     totalInstallments?: number,  // cuotas totales (opcional)
 *   }>
 * - notes?: string (opcional, texto extra)
 */
export default function ConfirmInstallmentPaymentModal({
    open,
    onCancel,
    onConfirm,
    entityName = 'Entidad',
    items = [],
    notes,
}) {
    // Bloquea scroll y agrega cierre por Escape
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKey = (e) => e.key === 'Escape' && onCancel?.();
        document.addEventListener('keydown', onKey);

        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener('keydown', onKey);
        };
    }, [open, onCancel]);

    const isSingle = items.length === 1;
    const single = isSingle ? items[0] : null;

    // Totales por moneda (para el caso múltiple)
    const totalsByCurrency = useMemo(() => {
        const map = new Map();
        for (const it of items) {
            const curr = it.currency || 'ARS';
            map.set(curr, (map.get(curr) || 0) + (it.amountToPay || 0));
        }
        return Array.from(map.entries()).map(([currency, amount]) => ({ currency, amount }));
    }, [items]);

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-payment-title"
            onMouseDown={onCancel} // click en backdrop cierra
        >
            <div
                className="w-full max-w-md rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-background-dark p-6 shadow-2xl"
                onMouseDown={(e) => e.stopPropagation()} // evita cierre al clickear dentro
            >
                <div className="flex flex-col gap-4 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon name="payments" className="text-4xl" />
                    </div>

                    {/* Header dinámico */}
                    <div className="flex flex-col gap-2">
                        <h2
                            id="confirm-payment-title"
                            className="text-xl font-bold text-slate-900 dark:text-white"
                        >
                            {isSingle ? 'Confirmar Pago de Cuota' : 'Confirmar Pago de Cuotas'}
                        </h2>

                        {!isSingle ? (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Estás por registrar el pago para{' '}
                                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                                    {items.length} gasto{items.length === 1 ? '' : 's'} activo
                                    {items.length === 1 ? '' : 's'}
                                </strong>{' '}
                                de la entidad{' '}
                                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                                    {entityName}
                                </strong>
                                .
                            </p>
                        ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Vas a registrar el pago de{' '}
                                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                                    {single.title}
                                </strong>{' '}
                                en{' '}
                                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                                    {entityName}
                                </strong>
                                .
                            </p>
                        )}
                    </div>

                    {/* Contenido */}
                    {isSingle ? (
                        // ---- Vista Detallada (1 gasto) ----
                        <div className="flex flex-col gap-4 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4 text-left">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        {single.title}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                        {single.type === 'debo' ? (
                                            <span className="inline-flex items-center rounded-md bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 font-medium text-red-700 dark:text-red-300">
                                                Debo
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-md bg-green-100 dark:bg-green-900/40 px-1.5 py-0.5 font-medium text-green-700 dark:text-green-300">
                                                Me deben
                                            </span>
                                        )}
                                        {typeof single.paidInstallments === 'number' &&
                                            typeof single.totalInstallments === 'number' && (
                                                <span className="text-xs">
                                                    {single.paidInstallments}/
                                                    {single.totalInstallments} cuotas pagadas
                                                </span>
                                            )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">
                                        {single.currency}{' '}
                                        {formatMoney(single.amountToPay, single.currency)}
                                    </p>
                                    {typeof single.totalAmount === 'number' && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            de {single.currency}{' '}
                                            {formatMoney(single.totalAmount, single.currency)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Barra de progreso si hay info de cuotas */}
                            {typeof single.paidInstallments === 'number' &&
                                typeof single.totalInstallments === 'number' &&
                                single.totalInstallments > 0 && (
                                    <div className="mt-1">
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full ${single.type === 'debo' ? 'bg-red-500' : 'bg-green-500'}`}
                                                style={{
                                                    width: `${Math.min(
                                                        100,
                                                        Math.max(
                                                            0,
                                                            (single.paidInstallments /
                                                                single.totalInstallments) *
                                                            100,
                                                        ),
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                            {notes && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {notes}
                                </p>
                            )}

                            {/* Total a pagar (resumen) */}
                            <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white/60 dark:bg-background-dark/60 p-3">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        Monto a pagar
                                    </span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                                        {single.currency}{' '}
                                        {formatMoney(single.amountToPay, single.currency)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // ---- Vista Resumen (N gastos) ----
                        <div className="flex flex-col gap-4 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4 text-left">
                            <div>
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                    Gastos a afectar:
                                </p>
                                <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
                                    {items.map((it) => (
                                        <li key={it.id}>
                                            {it.title}
                                            <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                                                ({it.currency}{' '}
                                                {formatMoney(it.amountToPay, it.currency)})
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-t border-black/10 dark:border-white/10" />

                            <div>
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                    Monto total a pagar:
                                </p>
                                <div className="mt-2 flex flex-col gap-1">
                                    {totalsByCurrency.map((row) => (
                                        <div
                                            key={row.currency}
                                            className="flex items-baseline justify-between"
                                        >
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                En {row.currency}
                                            </span>
                                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                                {row.currency}{' '}
                                                {formatMoney(row.amount, row.currency)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-2 flex flex-col-reverse sm:flex-row sm:justify-center gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            <span className="truncate">Cancelar</span>
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                        >
                            <Icon name="check_circle" className="mr-2 text-lg" />
                            <span className="truncate">Confirmar Pago</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}
