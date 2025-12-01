import { useMemo, useState, useCallback } from 'react';
import Icon from './Icon';
import { GROUPS } from '../../../data/constants';
import ConfirmInstallmentPaymentModal from './modals/ConfirmPaymentModal';

function parseAmountLabel(label) {
    // Ej: "ARS $15.000" -> { currency: "ARS", amount: 15000 }
    if (!label) return { currency: 'ARS', amount: 0 };
    const trimmed = String(label).trim();
    // Busca código de moneda (ARS|USD|EUR) al inicio
    const matchCurr = trimmed.match(/^(ARS|USD|EUR)/i);
    const currency = matchCurr ? matchCurr[1].toUpperCase() : 'ARS';
    // Busca número (con puntos como separadores de miles y coma como decimales)
    const matchNum = trimmed
        .replace(/\./g, '')
        .replace(',', '.')
        .match(/([\d]+(?:\.\d+)?)/);
    const amount = matchNum ? Number(matchNum[1]) : 0;
    return { currency, amount };
}

function parseTotalLabel(label, fallbackCurrency = 'ARS') {
    // Ej: "de $60.000" -> { currency: fallbackCurrency, amount: 60000 }
    if (!label) return { currency: fallbackCurrency, amount: undefined };
    const cleaned = String(label)
        .replace(/[^\d,.]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');
    const amount = cleaned ? Number(cleaned) : undefined;
    return { currency: fallbackCurrency, amount };
}

export default function ActiveExpenses({ query }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalEntity, setModalEntity] = useState('');
    const [modalItems, setModalItems] = useState([]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return GROUPS;
        return GROUPS.map((g) => ({
            ...g,
            items: g.items.filter((it) => it.title.toLowerCase().includes(q)),
        })).filter((g) => g.items.length > 0);
    }, [query]);

    const openModalForGroup = useCallback((group) => {
        // construir items para el modal desde todos los items del grupo
        const items = group.items.map((it, idx) => {
            const { currency, amount } = parseAmountLabel(it.amount);
            const { amount: totalAmount } = parseTotalLabel(it.total, currency);
            return {
                id: `${group.title}-${idx}`,
                title: it.title,
                type: (it.chip?.text || '').toLowerCase() === 'me deben' ? 'me_deben' : 'debo',
                currency,
                amountToPay: amount,
                totalAmount, // opcional
                // Si querés, podés sumar paidInstallments/totalInstallments en tu data source y mapearlos acá
            };
        });
        setModalEntity(group.title);
        setModalItems(items);
        setModalOpen(true);
    }, []);

    const openModalForItem = useCallback((group, it, idx) => {
        const { currency, amount } = parseAmountLabel(it.amount);
        const { amount: totalAmount } = parseTotalLabel(it.total, currency);
        const item = {
            id: `${group.title}-${idx}`,
            title: it.title,
            type: (it.chip?.text || '').toLowerCase() === 'me deben' ? 'me_deben' : 'debo',
            currency,
            amountToPay: amount,
            totalAmount, // opcional
            // Si tu dataset tiene cuotas, podés agregar:
            // paidInstallments: it.paidInstallments,
            // totalInstallments: it.totalInstallments,
        };
        setModalEntity(group.title);
        setModalItems([item]);
        setModalOpen(true);
    }, []);

    const handleConfirm = () => {
        // Acá hacés tu POST/acción para confirmar los pagos seleccionados (modalItems)
        // Ejemplo:
        // await api.confirmarPagoCuotas({ entity: modalEntity, items: modalItems })
        console.log('Confirmar pago:', { entity: modalEntity, items: modalItems });
        setModalOpen(false);
    };

    return (
        <div className="lg:col-span-2 xl:col-span-2 flex flex-col gap-4 rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white dark:bg-white/5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                    Gastos Activos
                </h3>
                <div className="relative w-full sm:max-w-xs">
                    <Icon
                        name="search"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        className="w-full rounded-lg border border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-700 py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary/50 focus:ring-primary/50"
                        placeholder="Buscar gasto..."
                        type="text"
                        value={query}
                        onChange={() => {
                            /* controlado desde el padre */
                        }}
                        readOnly
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto pr-2" style={{ maxHeight: 480 }}>
                {filtered.map((group) => (
                    <div key={group.title} className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-4 py-2 border-b border-black/10 dark:border-white/10">
                            <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                                {group.title}
                            </h4>
                            <button
                                className="shrink-0 text-xs font-bold leading-normal tracking-wide text-primary hover:text-primary/80 transition-colors"
                                onClick={() => openModalForGroup(group)}
                            >
                                {group.cta}
                            </button>
                        </div>
                        <ul className="flex flex-col gap-3">
                            {group.items.map((it, idx) => (
                                <li
                                    key={`${group.title}-${idx}`}
                                    className="flex flex-col gap-3 rounded-lg p-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex flex-col gap-1.5 flex-1">
                                            <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                                                {it.title}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                {it.chip && (
                                                    <span
                                                        className={`inline-flex items-center rounded-md px-1.5 py-0.5 font-medium ${it.chip.tone === 'red'
                                                            ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                                                            : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                                                            }`}
                                                    >
                                                        {it.chip.text}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 text-right">
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">
                                                {it.amount}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {it.total}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 flex-1">
                                            <div
                                                className={`${it.chip?.tone === 'green' ? 'bg-green-500' : 'bg-red-500'} h-1.5 rounded-full`}
                                                style={{ width: `${it.progressPct}%` }}
                                            />
                                        </div>
                                        <button
                                            className="text-xs font-bold leading-normal tracking-wide bg-primary/20 text-primary px-3 py-1.5 rounded-md hover:bg-primary/30 transition-colors"
                                            onClick={() => openModalForItem(group, it, idx)}
                                        >
                                            {it.action}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
                        No se encontraron gastos activos.
                    </div>
                )}
            </div>

            {/* Modal de confirmación */}
            <ConfirmInstallmentPaymentModal
                open={modalOpen}
                entityName={modalEntity}
                items={modalItems}
                onCancel={() => setModalOpen(false)}
                onConfirm={handleConfirm}
            />
        </div>
    );
}
