import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../Icon';

/**
 * Modal para crear una nueva entidad (banco, persona o servicio).
 * Props:
 * - open: boolean (controla visibilidad)
 * - onClose: () => void
 * - onSave: (payload: { name: string }) => void
 */
export default function NewEntityModal({ open, onClose, onSave }) {
    const [name, setName] = useState('');

    // Deshabilitar scroll del body cuando está abierto
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    // Cerrar con Escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && onClose?.();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    const canSave = useMemo(() => name.trim().length > 0, [name]);

    const handleSave = () => {
        if (!canSave) return;
        onSave?.({ name: name.trim() });
        setName('');
    };

    if (!open) return null;

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                onMouseDown={onClose} // click en backdrop cierra
            />

            {/* Modal */}
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
                aria-modal="true"
                role="dialog"
                aria-labelledby="new-entity-title"
                // Evita que el click dentro cierre (detiene burbujeo del backdrop)
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="relative flex flex-col w-full max-w-lg overflow-hidden bg-[#18211b] rounded-xl border border-[#3d5245] shadow-xl">
                    {/* Header */}
                    <div className="flex items-start justify-between p-6">
                        <div className="flex flex-col gap-1">
                            <h2
                                id="new-entity-title"
                                className="text-white text-xl font-bold tracking-tight"
                            >
                                Crear Nueva Entidad
                            </h2>
                            <p className="text-[#9eb7a8] text-sm">
                                Añade un nuevo banco, persona o servicio.
                            </p>
                        </div>
                        <button
                            type="button"
                            className="text-[#9eb7a8] transition-colors duration-200 hover:text-white"
                            onClick={onClose}
                            aria-label="Cerrar"
                        >
                            <Icon name="close" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 px-6 pb-6">
                        <div className="flex flex-col gap-4">
                            <label className="flex flex-col w-full">
                                <p className="text-white text-sm font-medium pb-2">
                                    Nombre de la entidad
                                </p>
                                <input
                                    className="form-input flex w/full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#3d5245] bg-[#1c2620] focus:border-primary h-12 placeholder:text-[#9eb7a8] px-4 py-3 text-base font-normal"
                                    placeholder="Ej: Banco Galicia, Juan Pérez, etc."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                />
                            </label>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 p-6 bg-[#1c2620]/60 border-t border-[#3d5245]">
                        <button
                            type="button"
                            className="flex w-full sm:w-auto min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-[#29382f] text-white text-sm font-bold tracking-wide transition-colors duration-200 hover:bg-[#34453a]"
                            onClick={onClose}
                        >
                            <span className="truncate">Cancelar</span>
                        </button>
                        <button
                            type="button"
                            disabled={!canSave}
                            className="flex w-full sm:w-auto min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-primary text-[#111714] text-sm font-bold tracking-wide transition-opacity duration-200 hover:opacity-80 disabled:opacity-60"
                            onClick={handleSave}
                        >
                            <span className="truncate">Guardar Entidad</span>
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body,
    );
}
