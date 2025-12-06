import { useState } from 'react';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';

export default function PeligroEliminar({ onDelete, label = 'Eliminar' }) {
    const [open, setOpen] = useState(false);
    return (
        <section className="mt-8 pt-6 border-t border-gray-800">
            <h3 className="text-lg font-bold text-red-500">Zona de Peligro</h3>

            <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <p className="font-bold text-white">{label}</p>
                    <p className="text-sm text-gray-400">
                        Una vez eliminada, esta acción no se puede deshacer.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setOpen(true);
                    }}
                    className="h-10 cursor-pointer px-4 rounded-lg text-sm font-bold border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors"
                >
                    Eliminar
                </button>
            </div>
            <ConfirmDeleteModal
                open={open}
                title={label}
                message="Esta acción no se puede deshacer."
                confirmLabel="Eliminar"
                cancelLabel="Cancelar"
                onCancel={() => setOpen(false)}
                onConfirm={() => {
                    onDelete();
                    setOpen(false);
                }}
            />
        </section>
    );
}
