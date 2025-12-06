import Icon from "../../../components/Icon";
import ConfirmInstallmentPaymentModal from "../../../components/modals/ConfirmPaymentModal";
import { useActiveExpensesFilter } from "../hooks/use-active-expenses-filter";
import { useActiveExpensesModal } from "../hooks/use-active-expenses-modal";
import { usePayments } from "../../../hooks/use-payments";
import { useNavigate } from "react-router-dom";

export default function ActiveExpenses({
    query,
    groups,
    currency,
    onCurrencyChange,
    onQueryChange,
    onPaid,
}) {
    const navigate = useNavigate();
    const filtered = useActiveExpensesFilter(groups, currency, query);
    const modal = useActiveExpensesModal();
    const { handleConfirm } = usePayments(onPaid);

    return (
        <div className="lg:col-span-3 xl:col-span-3 flex flex-col gap-4 rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white dark:bg-white/5 mt-6">

            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Left Section */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                        Gastos Activos
                    </h3>

                    {/* Currency Toggle */}
                    <div className="flex flex-wrap gap-2">
                        {["ARS", "USD", "EUR"].map((cur) => (
                            <button
                                key={cur}
                                type="button"
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${currency === cur
                                    ? "bg-primary text-black border-primary"
                                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600"
                                    }`}
                                onClick={() => onCurrencyChange?.(cur)}
                            >
                                {cur}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search */}
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

            {/* LIST */}
            <div
                className="flex flex-col gap-4 overflow-y-auto pr-2"
                style={{ maxHeight: 550 }}
            >
                {filtered.map((group) => (
                    <div key={group.id} className="flex flex-col gap-3">
                        {/* Group Header */}
                        <div className="flex items-center justify-between gap-4 py-2 border-b border-black/10 dark:border-white/10">
                            <h4
                                className="text-base font-semibold text-slate-800 dark:text-slate-100 cursor-pointer hover:underline"
                                onClick={() => navigate(`/entidades/${group.id}`)}
                            >
                                {group.title}
                            </h4>

                            <button
                                className="shrink-0 text-xs font-bold leading-normal tracking-wide text-primary hover:text-primary/80 transition-colors"
                                onClick={() => modal.openGroup(group)}
                                type="button"
                            >
                                {group.cta}
                            </button>
                        </div>

                        {/* Items */}
                        <ul className="flex flex-col gap-3">
                            {group.items.map((it) => (
                                <li
                                    key={it.id}
                                    className="flex flex-col gap-3 rounded-lg p-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                                >
                                    {/* Top row */}
                                    <div className="flex items-start justify-between gap-4">
                                        {/* LEFT */}
                                        <div className="flex flex-col gap-1.5 flex-1">
                                            <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                                                {it.title}
                                            </p>

                                            {/* Chip */}
                                            <span
                                                className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium 
                                                    ${it.type === "ME_DEBEN"
                                                        ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                                                        : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                                                    }`}
                                            >
                                                {it.type === "ME_DEBEN" ? "Me deben" : "Debo"}
                                            </span>
                                        </div>

                                        {/* RIGHT */}
                                        <div className="flex flex-col items-end gap-2 text-right">
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">
                                                {`${it.currency} $${it.amountPerInstallment.toFixed(2)}`}
                                            </p>

                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {it.installments.total
                                                    ? `de ${it.currency} $${it.totalAmount.toFixed(
                                                        2
                                                    )} · ${it.installments.paid}/${it.installments.total} cuotas`
                                                    : `Total ${it.currency} $${it.totalAmount.toFixed(
                                                        2
                                                    )}`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* PROGRESS BAR */}
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 flex-1">
                                            <div
                                                className={`h-1.5 rounded-full ${it.type === "ME_DEBEN"
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                                    }`}
                                                style={{ width: `${it.progress}%` }}
                                            />
                                        </div>

                                        <button
                                            className="text-xs font-bold leading-normal tracking-wide bg-primary/20 text-primary px-3 py-1.5 rounded-md hover:bg-primary/30 transition-colors"
                                            onClick={() => modal.openItem(group, it)}
                                        >
                                            {it.type === "ME_DEBEN"
                                                ? "Registrar cobro"
                                                : "Pagar cuota"}
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

            {/* MODAL */}
            <ConfirmInstallmentPaymentModal
                open={modal.modalOpen}
                entityName={modal.modalEntity}
                items={modal.modalItems}
                onCancel={() => modal.setModalOpen(false)}
                onConfirm={() => {
                    handleConfirm(modal.modalItems);
                    modal.setModalOpen(false);
                }}
            />
        </div>
    );
}
