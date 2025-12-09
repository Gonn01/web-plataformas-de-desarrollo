import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ConfirmDeleteModal({
    open,
    title = '¿Eliminar?',
    message = 'Esta acción no se puede deshacer.',
    confirmLabel = 'Eliminar',
    cancelLabel = 'Cancelar',
    onConfirm,
    onCancel,
}) {
    const [visible, setVisible] = useState(open);

    useEffect(() => {
        if (open) {
            setVisible(true);
        } else {
            const t = setTimeout(() => setVisible(false), 150);
            return () => clearTimeout(t);
        }
    }, [open]);

    if (!open && !visible) return null;

    return createPortal(
        <div
            className={`
                fixed inset-0 z-50 flex items-center justify-center 
                bg-black/60 backdrop-blur-sm 
                transition-opacity duration-150
                ${open ? 'opacity-100' : 'opacity-0'}
            `}
        >
            <div
                className={`
                    w-[90vw] max-w-sm rounded-xl bg-[#111714] p-6 border border-[#29382f]
                    shadow-lg text-white transition-all duration-150
                    ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                `}
            >
                <h2 className="text-lg font-bold mb-2">{title}</h2>

                <p className="text-sm text-[#9eb7a8] mb-6">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="h-10 px-4 rounded-lg text-sm font-bold text-[#9eb7a8] hover:bg-[#29382f] transition-colors"
                    >
                        {cancelLabel}
                    </button>

                    <button
                        onClick={onConfirm}
                        className="h-10 px-4 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}
