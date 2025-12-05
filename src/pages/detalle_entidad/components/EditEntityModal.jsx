import { useState } from 'react';
import Icon from '../../../components/Icon';

export default function EditEntityModal({ open, entity, onClose, onSave, onDelete }) {
    const [name, setName] = useState(entity?.name || '');

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-md p-6">
                <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
                    <Icon name="edit" /> Editar Entidad
                </h2>

                {/* INPUT */}
                <div className="mb-4">
                    <label className="text-sm text-zinc-600 dark:text-zinc-300">Nombre</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg border dark:border-zinc-700 bg-transparent dark:text-white"
                    />
                </div>

                {/* BOTONES */}
                <div className="flex justify-between mt-6">
                    <button
                        className="px-4 py-2 bg-zinc-300 hover:bg-zinc-400 rounded-lg dark:bg-zinc-700 dark:hover:bg-zinc-600 text-black dark:text-white"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>

                    <button
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
                        onClick={() => onDelete()}
                    >
                        Eliminar
                    </button>

                    <button
                        className="px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg text-white"
                        onClick={() => onSave(name)}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
