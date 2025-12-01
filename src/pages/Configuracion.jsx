import { useState } from 'react';
import useAuth from '@/hooks/use-auth';

export default function Configuracion() {
    const { usuario, setUsuario } = useAuth() || {};

    // estados locales para lo editable
    const [preview, setPreview] = useState(usuario?.avatar || '');
    const [nombreVisible, setNombreVisible] = useState(usuario?.nombre || 'Usuario');
    const [moneda, setMoneda] = useState('ARS');

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        // objeto usuario actualizado
        const actualizado = {
            ...usuario,
            nombre: nombreVisible,
            avatar: preview,
            monedaPreferida: moneda,
        };

        // si el contexto expone setUsuario, lo usamos
        if (typeof setUsuario === 'function') {
            setUsuario(actualizado);
        }

        // lo guardo en localStorage
        localStorage.setItem('auth_usuario', JSON.stringify(actualizado));

        alert('Datos de usuario actualizados.');
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
                {/* Datos del usuario */}
                <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-background-dark/70">
                    <h2 className="text-base font-medium mb-3 text-slate-900 dark:text-white">
                        Datos del usuario
                    </h2>

                    <div className="space-y-3 text-sm">
                        {/* FOTO DE PERFIL */}
                        <div className="flex flex-col gap-2">
                            <p className="text-slate-600 dark:text-slate-300 font-medium">
                                Foto de perfil
                            </p>

                            <div className="flex items-center gap-4">
                                <div
                                    className="size-16 rounded-full bg-cover bg-center border border-black/20 dark:border-white/20"
                                    style={{ backgroundImage: `url(${preview})` }}
                                />

                                <label className="cursor-pointer text-primary hover:underline">
                                    Cambiar foto
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* NOMBRE VISIBLE */}
                        <div className="flex flex-col gap-1 mt-3">
                            <label className="text-slate-600 dark:text-slate-300 font-medium">
                                Nombre visible
                            </label>
                            <input
                                type="text"
                                className="rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-background-dark px-3 py-2 text-sm text-slate-900 dark:text-white"
                                value={nombreVisible}
                                onChange={(e) => setNombreVisible(e.target.value)}
                            />
                        </div>

                        <p className="text-slate-600 dark:text-slate-300">
                            <span className="font-medium">Email: </span>
                            {usuario?.email}
                        </p>
                    </div>
                </div>

                {/* Preferencias */}
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
                            </select>
                        </div>

                        <button
                            type="button"
                            className="mt-2 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition"
                            onClick={handleSave}
                        >
                            Guardar cambios
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
