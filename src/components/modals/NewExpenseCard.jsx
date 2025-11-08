// src/pages/NewExpenseCard.jsx
import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

function Icon({ name, className = '' }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export default function NewExpenseCard({ onClose, onSave }) {
    const [type, setType] = useState('Debo');
    const [name, setName] = useState('');
    const [entity, setEntity] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('ARS');
    const [installments, setInstallments] = useState('');
    const [paidInstallments, setPaidInstallments] = useState('0');
    const [ignoreInBalance, setIgnoreInBalance] = useState(false);
    const [files, setFiles] = useState(null);

    const totalInstallments = Number(installments) || 0;
    const paid = Math.min(Number(paidInstallments) || 0, totalInstallments);
    const progressPct =
        totalInstallments > 0 ? Math.min(100, Math.max(0, (paid / totalInstallments) * 100)) : 0;

    const canSave = useMemo(
        () => name.trim() && entity.trim() && Number(amount) > 0 && currency,
        [name, entity, amount, currency],
    );

    const handleSubmit = () => {
        if (!canSave) return;
        onSave?.({
            type,
            name: name.trim(),
            entity: entity.trim(),
            amount: Number(amount),
            currency,
            installments: totalInstallments,
            paidInstallments: paid,
            ignoreInBalance,
            files,
        });
    };

    // --- Modal UX: bloquear scroll y cerrar con Escape / click afuera ---
    const containerRef = useRef(null);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        document.addEventListener('keydown', onKey);

        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden'; // lock scroll

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    const modalContent = (
        <div
            className="fixed inset-0 z-999 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-expense-title"
            onMouseDown={(e) => {
                // cierre al hacer click en el backdrop (evita cerrar si clickeás dentro del card)
                if (e.target === e.currentTarget) onClose?.();
            }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Contenedor del modal */}
            <div
                ref={containerRef}
                className="relative z-10 w-[92vw] max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-xl 
                   bg-[#111714] border border-[#29382f] animate-in fade-in zoom-in duration-150"
            >
                {/* Header */}
                <header className="sticky top-0 flex items-center justify-between border-b border-b-[#29382f] px-6 py-4 bg-[#111714]">
                    <div className="flex items-center gap-3 text-white">
                        <div className="size-5 text-primary">
                            <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path
                                    clipRule="evenodd"
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"
                                />
                            </svg>
                        </div>
                        <h2
                            id="new-expense-title"
                            className="text-white text-lg font-bold tracking-[-0.015em]"
                        >
                            Nuevo Gasto
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#29382f] text-white hover:bg-[#3d5245]"
                        aria-label="Cerrar"
                    >
                        <Icon name="close" className="text-xl" />
                    </button>
                </header>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Type selector */}
                    <div className="flex h-12 items-center justify-center rounded-lg bg-[#29382f] p-1.5">
                        <label className="flex cursor-pointer h-full grow items-center justify-center gap-2 overflow-hidden rounded-md px-3 has-checked:bg-red-500/10 has-checked:text-red-400 text-[#9eb7a8] text-sm font-medium transition-colors">
                            <Icon name="arrow_upward" className="text-base" />
                            <span className="truncate">Debo</span>
                            <input
                                className="invisible w-0"
                                type="radio"
                                name="debt_type"
                                value="Debo"
                                checked={type === 'Debo'}
                                onChange={() => setType('Debo')}
                            />
                        </label>
                        <label className="flex cursor-pointer h-full grow items-center justify-center gap-2 overflow-hidden rounded-md px-3 has-checked:bg-green-500/10 has-checked:text-green-400 text-[#9eb7a8] text-sm font-medium transition-colors">
                            <Icon name="arrow_downward" className="text-base" />
                            <span className="truncate">Me deben</span>
                            <input
                                className="invisible w-0"
                                type="radio"
                                name="debt_type"
                                value="Me deben"
                                checked={type === 'Me deben'}
                                onChange={() => setType('Me deben')}
                            />
                        </label>
                    </div>

                    {/* Core info */}
                    <div className="space-y-4">
                        <label className="flex flex-col">
                            <p className="text-white text-sm font-medium pb-2">Nombre del Gasto</p>
                            <input
                                className="form-input h-12 w-full rounded-lg border border-[#3d5245] bg-[#1c2620] p-[15px] text-base text-white placeholder:text-[#9eb7a8] focus:border-primary focus:ring-2 focus:ring-primary/40"
                                placeholder="Ej: Préstamo personal"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                        <label className="flex flex-col">
                            <p className="text-white text-sm font-medium pb-2">
                                Entidad financiera
                            </p>
                            <input
                                className="form-input h-12 w-full rounded-lg border border-[#3d5245] bg-[#1c2620] p-[15px] text-base text-white placeholder:text-[#9eb7a8] focus:border-primary focus:ring-2 focus:ring-primary/40"
                                placeholder="Ej: Banco Galicia"
                                value={entity}
                                onChange={(e) => setEntity(e.target.value)}
                            />
                        </label>
                    </div>

                    {/* Financial details */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
                        <label className="flex flex-col col-span-1 sm:col-span-3">
                            <p className="text-white text-sm font-medium pb-2">Monto Total</p>
                            <input
                                className="form-input h-12 w-full rounded-lg border border-[#3d5245] bg-[#1c2620] p-[15px] text-base text-white placeholder:text-[#9eb7a8] focus:border-primary focus:ring-2 focus:ring-primary/40"
                                placeholder="150000"
                                type="number"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </label>

                        <div className="relative col-span-1 sm:col-span-2">
                            <label
                                className="text-white text-sm font-medium pb-2 absolute -top-7"
                                htmlFor="currency-select"
                            >
                                Moneda
                            </label>
                            <select
                                id="currency-select"
                                className="form-select h-12 w-full appearance-none rounded-lg border border-[#3d5245] bg-[#1c2620] p-3 text-base text-white placeholder:text-[#9eb7a8] focus:border-primary focus:ring-2 focus:ring-primary/40"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                            >
                                <option>ARS</option>
                                <option>USD</option>
                                <option>EUR</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#9eb7a8]">
                                <Icon name="expand_more" />
                            </div>
                        </div>
                    </div>

                    {/* Installments */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex flex-col">
                                <p className="text-white text-sm font-medium pb-2">
                                    Cantidad de Cuotas
                                </p>
                                <input
                                    className="form-input h-12 w-full rounded-lg border border-[#3d5245] bg-[#1c2620] p-3 text-base text-white placeholder:text-[#9eb7a8] focus:border-primary focus:ring-2 focus:ring-primary/40"
                                    placeholder="12"
                                    type="number"
                                    min="0"
                                    value={installments}
                                    onChange={(e) => setInstallments(e.target.value)}
                                />
                            </label>
                            <label className="flex flex-col">
                                <p className="text-sm font-medium pb-2 text-gray-500">
                                    Cuotas Pagadas
                                </p>
                                <input
                                    className="form-input h-12 w-full rounded-lg border border-transparent bg-[#29382f] p-3 text-base text-gray-500 placeholder:text-gray-600 cursor-not-allowed"
                                    placeholder="0"
                                    type="number"
                                    disabled
                                    value={paidInstallments}
                                    onChange={(e) => setPaidInstallments(e.target.value)}
                                />
                            </label>
                        </div>

                        <div>
                            <p className="text-white text-sm font-medium pb-2">Progreso</p>
                            <div className="w-full bg-[#29382f] rounded-full h-2.5">
                                <div
                                    className="bg-primary h-2.5 rounded-full"
                                    style={{ width: `${progressPct}%` }}
                                />
                            </div>
                            <p className="text-right text-xs text-[#9eb7a8] mt-1">
                                {paid} de {totalInstallments} cuotas pagadas
                            </p>
                        </div>
                    </div>

                    {/* Attachments */}
                    <div>
                        <p className="text-white text-sm font-medium pb-2">Adjuntar Imágenes</p>
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#3d5245] border-dashed rounded-lg cursor-pointer bg-[#1c2620] hover:bg-[#29382f] transition-colors"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Icon name="cloud_upload" className="text-4xl text-[#9eb7a8]" />
                                    <p className="mb-2 text-sm text-[#9eb7a8]">
                                        <span className="font-semibold text-primary">
                                            Haz clic para subir o arrastra y suelta
                                        </span>
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG o PDF (MAX. 5MB)
                                    </p>
                                </div>
                                <input
                                    className="hidden"
                                    id="dropzone-file"
                                    type="file"
                                    multiple
                                    onChange={(e) => setFiles(e.target.files)}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Advanced Options */}
                    <div>
                        <label className="flex items-center justify-between cursor-pointer">
                            <div>
                                <p className="text-white text-sm font-medium">
                                    Ignorar en el balance
                                </p>
                                <p className="text-xs text-[#9eb7a8]">
                                    Excluye este gasto de los cálculos totales.
                                </p>
                            </div>
                            <div className="relative inline-flex items-center">
                                <input
                                    className="sr-only peer"
                                    type="checkbox"
                                    checked={ignoreInBalance}
                                    onChange={(e) => setIgnoreInBalance(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-[#29382f] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                            </div>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <footer className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-t-[#29382f] px-6 py-4 bg-[#111714]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-11 items-center justify-center rounded-lg bg-transparent text-[#9eb7a8] text-sm font-bold px-4 transition-colors hover:bg-[#29382f]"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={!canSave}
                        onClick={handleSubmit}
                        className="flex h-11 items-center justify-center rounded-lg bg-primary text-background-dark gap-2 text-sm font-bold px-4 transition-opacity hover:opacity-90 disabled:opacity-60"
                    >
                        <Icon name="save" className="text-lg" />
                        <span>Guardar Gasto</span>
                    </button>
                </footer>
            </div>
        </div>
    );

    // Montar con portal al <body> para que siempre esté por encima
    return createPortal(modalContent, document.body);
}
