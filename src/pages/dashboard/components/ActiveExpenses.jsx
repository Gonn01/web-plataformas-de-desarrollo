import { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/Icon';
import ConfirmInstallmentPaymentModal from './modals/ConfirmPaymentModal';

function parseAmountLabel(label) {
    if (!label) return { currency: 'ARS', amount: 0 };
    const trimmed = String(label).trim();
    const matchCurr = trimmed.match(/^(ARS|USD|EUR)/i);
    const currency = matchCurr ? matchCurr[1].toUpperCase() : 'ARS';

    const matchNum = trimmed
        .replace(/\./g, '')
        .replace(',', '.')
        .match(/([\d]+(?:\.\d+)?)/);
    const amount = matchNum ? Number(matchNum[1]) : 0;

    return { currency, amount };
}

function parseTotalLabel(label, fallbackCurrency = 'ARS') {
    if (!label) return { currency: fallbackCurrency, amount: undefined };
    const cleaned = String(label)
        .replace(/[^\d,.]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');
    const amount = cleaned ? Number(cleaned) : undefined;
    return { currency: fallbackCurrency, amount };
}

export default function ActiveExpenses({
    query,
    groups = [],
    token,
    currency = 'ARS',
    onCurrencyChange,
    onQueryChange,
    onPaid,
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalEntity, setModalEntity] = useState('');
    const [modalItems, setModalItems] = useState([]);
    const navigate = useNavigate();

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        let baseGroups = groups;

        if (q) {
            baseGroups = baseGroups
                .map((g) => ({
                    ...g,
                    items: g.items.filter((it) => it.title.toLowerCase().includes(q)),
                }))
                .filter((g) => g.items.length > 0);
        }
        const cur = currency || 'ARS';

        const byCurrency = baseGroups
            .map((g) => ({
                ...g,
                items: g.items.filter((it) => {
                    const label = it.currency_label || parseAmountLabel(it.amount).currency;
                    return label === cur;
                }),
            }))
            .filter((g) => g.items.length > 0);

        return byCurrency;
    }, [query, groups, currency]);

    const openModalForGroup = useCallback((group) => {
        const items = group.items.map((it) => {
            const { currency: ccy, amount } = parseAmountLabel(it.amount);
            const { amount: totalAmount } = parseTotalLabel(it.total, ccy);

            return {
                id: it.id,
                purchaseId: it.purchaseId ?? it.id,
                title: it.title,
                type: (it.chip?.text || '').toLowerCase() === 'me deben' ? 'me_deben' : 'debo',
                currency: ccy,
                amountToPay: amount,
                totalAmount,
                paidInstallments: it.payed_quotas,
                totalInstallments: it.number_of_quotas,
            };
        });

        setModalEntity(group.title);
        setModalItems(items);
        setModalOpen(true);
    }, []);

    const openModalForItem = useCallback((group, it) => {
        const { currency: ccy, amount } = parseAmountLabel(it.amount);
        const { amount: totalAmount } = parseTotalLabel(it.total, ccy);

        const item = {
            id: it.id,
            purchaseId: it.purchaseId ?? it.id,
            title: it.title,
            type: (it.chip?.text || '').toLowerCase() === 'me deben' ? 'me_deben' : 'debo',
            currency: ccy,
            amountToPay: amount,
            totalAmount,
            paidInstallments: it.payed_quotas,
            totalInstallments: it.number_of_quotas,
        };

        setModalEntity(group.title);
        setModalItems([item]);
        setModalOpen(true);
    }, []);

    /* const handleConfirm = useCallback(async () => {
        try {
            if (!modalItems.length) {
                setModalOpen(false);
                return;
            }

            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

            if (modalItems.length === 1) {
                const purchaseId = modalItems[0].purchaseId;
                const res = await fetch(`${baseUrl}/dashboard/pagar-cuota`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({ purchase_id: purchaseId }),
                });

                if (!res.ok) {
                    const errText = await res.text();
                    console.error('Error al pagar cuota:', errText);
                    alert('No se pudo registrar el pago de la cuota.');
                    return;
                }
            } else {
                const purchaseIds = modalItems.map((it) => it.purchaseId);
                const res = await fetch(`${baseUrl}/dashboard/pagar-cuotas-lote`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({ purchase_ids: purchaseIds }),
                });

                if (!res.ok) {
                    const errText = await res.text();
                    console.error('Error al pagar cuotas en lote:', errText);
                    alert('No se pudieron registrar los pagos.');
                    return;
                }

                setModalOpen(false);

                if (onPaid) {
                    await onPaid();
                }
            }

            setModalOpen(false);

            if (onPaid) {
                onPaid();
            }
        } catch (err) {
            console.error('Error inesperado al pagar cuota(s):', err);
            alert('Ocurrió un error al registrar el pago.');
        }
    }, [modalItems, token, onPaid]);
 */
    const handleConfirm = useCallback(async () => {
        try {
            if (!modalItems.length) {
                setModalOpen(false);
                return;
            }

            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

            if (modalItems.length === 1) {
                const purchaseId = modalItems[0].purchaseId;
                const res = await fetch(`${baseUrl}/dashboard/pagar-cuota`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({ purchase_id: purchaseId }),
                });

                if (!res.ok) {
                    const errText = await res.text();
                    console.error('Error al pagar cuota:', errText);
                    alert('No se pudo registrar el pago de la cuota.');
                    return;
                }
            } else {
                const purchaseIds = modalItems.map((it) => it.purchaseId);
                const res = await fetch(`${baseUrl}/dashboard/pagar-cuotas-lote`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({ purchase_ids: purchaseIds }),
                });

                if (!res.ok) {
                    const errText = await res.text();
                    console.error('Error al pagar cuotas en lote:', errText);
                    alert('No se pudieron registrar los pagos.');
                    return;
                }

                setModalOpen(false);

                if (onPaid) {
                    await onPaid();
                }
            }

            setModalOpen(false);

            if (onPaid) {
                await onPaid();
            }
        } catch (err) {
            console.error('Error inesperado al pagar cuota(s):', err);
            alert('Ocurrió un error al registrar el pago.');
        }
    }, [modalItems, token, onPaid]);

    return (
        <div className="lg:col-span-3 xl:col-span-3 flex flex-col gap-4 rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white dark:bg-white/5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2">
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                        Gastos Activos
                    </h3>
                    {/* Botones de moneda dentro de Gastos Activos */}
                    <div className="flex flex-wrap gap-2">
                        {['ARS', 'USD', 'EUR'].map((cur) => (
                            <button
                                key={cur}
                                type="button"
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${currency === cur
                                    ? 'bg-primary text-black border-primary'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600'
                                    }`}
                                onClick={() => onCurrencyChange?.(cur)}
                            >
                                {cur}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Buscador */}
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
                        onChange={(e) => onQueryChange?.(e.target.value)}
                    />
                </div>
            </div>

            <div
                className="flex flex-col gap-4 overflow-y-auto pr-2"
                style={{ maxHeight: 550 }}
            >
                {filtered.map((group) => (
                    <div key={group.title} className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-4 py-2 border-b border-black/10 dark:border-white/10">
                            <h4
                                className="text-base font-semibold text-slate-800 dark:text-slate-100 cursor-pointer hover:underline"
                                onClick={() => navigate(`/entidades/${group.id}`)}
                            >
                                {group.title}
                            </h4>
                            <button
                                className="shrink-0 text-xs font-bold leading-normal tracking-wide text-primary hover:text-primary/80 transition-colors"
                                onClick={() => openModalForGroup(group)}
                                type="button"
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
                                                className={`${it.chip?.tone === 'green'
                                                    ? 'bg-green-500'
                                                    : 'bg-red-500'
                                                    } h-1.5 rounded-full`}
                                                style={{
                                                    width: `${it.progressPct}%`,
                                                }}
                                            />
                                        </div>
                                        <button
                                            className="text-xs font-bold leading-normal tracking-wide bg-primary/20 text-primary px-3 py-1.5 rounded-md hover:bg-primary/30 transition-colors"
                                            onClick={() => openModalForItem(group, it, idx)}
                                            type="button"
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
