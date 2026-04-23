import { useState, useEffect, useMemo } from 'react';
import Icon from '../../../components/Icon';

export default function EditEntityModal({
    open,
    entity,
    onClose,
    onSave,
    saving = false,
    onVincular,
    onDesvincular,
    loadingVincular = false,
}) {
    const initialName = entity?.name || '';
    const [name, setName] = useState(initialName);
    const [emailInput, setEmailInput] = useState('');
    const [vincularError, setVincularError] = useState('');

    useEffect(() => {
        setName(entity?.name || '');
        setEmailInput('');
        setVincularError('');
    }, [entity]);

    const canSave = useMemo(() => {
        if (saving) return false;
        if (!name.trim()) return false;
        if (name.trim() === initialName.trim()) return false;
        return true;
    }, [name, initialName, saving]);

    const handleVincular = async () => {
        if (!emailInput.trim()) return;
        setVincularError('');
        try {
            await onVincular(emailInput.trim());
            setEmailInput('');
        } catch (err) {
            setVincularError(err?.response?.data?.error || 'Error al vincular usuario');
        }
    };

    const handleDesvincular = async () => {
        setVincularError('');
        try {
            await onDesvincular();
        } catch (err) {
            setVincularError(err?.response?.data?.error || 'Error al desvincular usuario');
        }
    };

    if (!open) return null;

    const isLinked = !!entity?.linked_user_id;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-md p-6 overflow-hidden">
                {/* OVERLAY LOADER */}
                {saving && (
                    <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                        <Icon name="progress_activity" className="animate-spin text-primary text-4xl" />
                        <p className="text-sm font-medium text-white">Guardando cambios…</p>
                    </div>
                )}

                {/* HEADER */}
                <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
                    <Icon name="edit" />
                    Editar Entidad
                </h2>

                {/* NOMBRE */}
                <div className="mb-6">
                    <label className="text-sm text-zinc-600 dark:text-zinc-300">Nombre</label>
                    <input
                        type="text"
                        value={name}
                        disabled={saving}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg border dark:border-zinc-700 bg-transparent dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                </div>

                {/* DIVIDER */}
                <div className="border-t border-zinc-200 dark:border-zinc-700 mb-6" />

                {/* USUARIO VINCULADO */}
                <div className="mb-6">
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
                        <Icon name="link" className="text-base" />
                        Usuario vinculado
                    </p>

                    {isLinked ? (
                        <div className="flex items-center justify-between gap-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg px-3 py-2">
                            <div className="min-w-0">
                                <p className="text-sm font-medium dark:text-white truncate">
                                    {entity.linked_user_name || 'Usuario'}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                    {entity.linked_user_email}
                                </p>
                            </div>
                            <button
                                onClick={handleDesvincular}
                                disabled={loadingVincular}
                                className="shrink-0 flex items-center gap-1 text-xs text-red-500 hover:text-red-600 disabled:opacity-50"
                            >
                                {loadingVincular ? (
                                    <Icon name="progress_activity" className="animate-spin text-sm" />
                                ) : (
                                    <Icon name="link_off" className="text-sm" />
                                )}
                                Desvincular
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Email del usuario"
                                    value={emailInput}
                                    disabled={loadingVincular}
                                    onChange={(e) => {
                                        setEmailInput(e.target.value);
                                        setVincularError('');
                                    }}
                                    className="flex-1 px-3 py-2 rounded-lg border dark:border-zinc-700 bg-transparent dark:text-white text-sm disabled:opacity-60"
                                />
                                <button
                                    onClick={handleVincular}
                                    disabled={!emailInput.trim() || loadingVincular}
                                    className="shrink-0 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-1"
                                >
                                    {loadingVincular ? (
                                        <Icon name="progress_activity" className="animate-spin text-sm" />
                                    ) : (
                                        'Vincular'
                                    )}
                                </button>
                            </div>
                            {vincularError && (
                                <p className="text-xs text-red-500">{vincularError}</p>
                            )}
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                Los gastos creados en esta entidad se compartirán automáticamente con ese usuario.
                            </p>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="flex justify-between mt-2">
                    <button
                        disabled={saving}
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-black dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        disabled={!canSave}
                        onClick={() => onSave(name.trim())}
                        className="px-4 py-2 rounded-lg bg-primary text-white flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Guardar nombre
                    </button>
                </div>
            </div>
        </div>
    );
}
