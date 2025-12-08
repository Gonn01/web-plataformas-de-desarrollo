import { useEffect, useState } from 'react';
import useAuth from '@/hooks/use-auth';

export function currencyCodeToLabel(codeOrLabel) {
    if (typeof codeOrLabel === 'string') {
        if (['ARS', 'USD', 'EUR'].includes(codeOrLabel)) return codeOrLabel;
    }

    const code = Number(codeOrLabel);
    switch (code) {
        case 0:
            return 'ARS';
        case 1:
            return 'USD';
        case 2:
            return 'EUR';
        default:
            return 'ARS';
    }
}

export function currencyLabelToCode(label) {
    switch (label) {
        case 'ARS':
            return 0;
        case 'USD':
            return 1;
        case 'EUR':
            return 2;
        default:
            return 0;
    }
}

export default function Configuracion() {
    const { user, updateUser } = useAuth();
    const [preview, setPreview] = useState('');
    const [nombreVisible, setNombreVisible] = useState('Usuario');
    const [moneda, setMoneda] = useState('ARS');
    const [loading, setLoading] = useState(false);

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    useEffect(() => {
        if (!user) return;

        setPreview(user.avatar || '');
        setNombreVisible(user.name || user.nombre || 'Usuario');

        const pref = user.preferred_currency !== undefined ? user.preferred_currency : user.monedaPreferida;
        const label = pref ? currencyCodeToLabel(pref) : 'ARS';
        setMoneda(label);
    }, [user]);

    const handleSave = async () => {
        if (!user?.id) {
            alert('No se encontró el ID de usuario.');
            return;
        }

        try {
            setLoading(true);

            const preferred_currency = currencyLabelToCode(moneda);

            const res = await fetch(`${baseUrl}/auth/preferred-currency`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    preferred_currency,
                }),
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error('Error actualizando moneda preferida:', res.status, errText);
                alert('No se pudieron guardar los cambios.');
                setLoading(false);
                return;
            }

            const json = await res.json();
            const updatedFromApi = json.data || json.user || json;

            if (typeof updateUser === 'function') {
                updateUser({
                    ...(user || {}),
                    ...updatedFromApi,
                    preferred_currency,
                    monedaPreferida: moneda,
                });
            }

            alert('Moneda preferida actualizada.');
        } catch (err) {
            console.error('Error guardando configuración:', err);
            alert('Ocurrió un error al guardar los cambios.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 flex flex-col gap-6">
            <header>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                    Configuración de la cuenta
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Personalizá tus datos y preferencias básicas.
                </p>
            </header>

            <section className="grid gap-6 md:grid-cols-2">
                {/* DATOS DEL USUARIO (SOLO LECTURA) */}
                <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-background-dark/70">
                    <h2 className="text-base font-medium mb-3 text-slate-900 dark:text-white">
                        Datos del usuario
                    </h2>

                    <div className="space-y-3 text-sm">
                        {/* FOTO DE PERFIL (solo mostrar) */}
                        <div className="flex flex-col gap-2">
                            <p className="text-slate-600 dark:text-slate-300 font-medium">
                                Foto de perfil
                            </p>

                            <div className="flex items-center gap-4">
                                <div
                                    className="size-16 rounded-full bg-cover bg-center border border-black/20 dark:border-white/20"
                                    style={{
                                        backgroundImage: preview ? `url(${preview})` : 'none',
                                    }}
                                />
                            </div>
                        </div>

                        {/* NOMBRE VISIBLE (solo lectura) */}
                        <p className="text-slate-600 dark:text-slate-300 mt-3">
                            <span className="font-medium">Nombre: </span>
                            {nombreVisible}
                        </p>

                        {/* EMAIL (solo lectura) */}
                        <p className="text-slate-600 dark:text-slate-300 mt-3">
                            <span className="font-medium">Email: </span>
                            {user?.email || '—'}
                        </p>
                    </div>
                </div>

                {/* PREFERENCIAS */}
                <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-background-dark/70">
                    <h2 className="text-base font-medium mb-3 text-slate-900 dark:text-white">
                        Preferencias
                    </h2>

                    <form className="space-y-4 text-sm" onSubmit={(e) => e.preventDefault()}>
                        <div className="flex flex-col gap-1">
                            <label className="text-slate-600 dark:text-slate-300">
                                Moneda principal
                            </label>
                            <select
                                className="rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-background-dark px-3 py-2 text-sm text-slate-900 dark:text-white"
                                value={moneda}
                                onChange={(e) => setMoneda(e.target.value)}
                            >
                                <option value="ARS">ARS (Pesos Argentinos)</option>
                                <option value="USD">USD (Dólares)</option>
                                <option value="EUR">EUR (Euros)</option>
                            </select>
                        </div>

                        <button
                            type="button"
                            className="mt-2 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}


