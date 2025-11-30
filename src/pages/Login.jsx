import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/use-auth';
import { autenticar } from '../services/auth';
import { auth, googleProvider } from '../../firebase.js';

// Firebase
import { signInWithPopup } from 'firebase/auth';

export default function Login() {
    const nav = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [clave, setClave] = useState('');
    const [mostrar, setMostrar] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    // --- validaciones ---
    const validar = () => {
        if (!email.includes('@')) return 'Email inválido';
        if (clave.length < 6) return 'La contraseña debe tener 6+ caracteres';
        return '';
    };

    // ================================
    // 📌 LOGIN TRADICIONAL
    // ================================
    const onSubmit = async (e) => {
        e.preventDefault();
        const msg = validar();
        if (msg) return setError(msg);

        try {
            setCargando(true);
            setError('');
            const user = await autenticar(email, clave);
            login(user);
            nav('/app/dashboard', { replace: true });
        } catch (err) {
            setError(err?.message || 'Error de autenticación');
        } finally {
            setCargando(false);
        }
    };

    // ================================
    // 📌 LOGIN CON GOOGLE
    // ================================
    const loginWithGoogle = async () => {
        try {
            setCargando(true);
            setError('');

            // 1. Popup Google
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            // 3. Llamar backend
            const res = await fetch('http://localhost:3000/api/auth/firebase-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firebaseId: firebaseUser.uid,
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Error con Google Login');

            // 4. Guardar usuario en contexto
            login(data.user);

            // 5. Redirigir
            nav('/app/dashboard', { replace: true });
        } catch (err) {
            console.log(err);
            setError(err.message || 'Error iniciando sesión con Google');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-dvh w-full flex justify-center items-start sm:items-center bg-background-dark text-white px-4 py-10 sm:py-16 font-display">
            <div className="w-full max-w-lg bg-emerald-950/40 border border-emerald-900/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_0_1px_rgba(16,185,129,0.08),0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm">
                {/* Brand */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <span className="material-symbols-outlined text-3xl">
                            account_balance_wallet
                        </span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-white">Mis Cuentas</h1>
                    <p className="mt-1 text-sm text-gray-400">Controla tus finanzas personales.</p>
                </div>

                {/* Card */}
                <div className="rounded-xl border border-gray-700/50 bg-black/20 p-6 sm:p-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-white">
                            Bienvenido de vuelta
                        </h2>
                        <p className="mt-2 text-base text-gray-400">
                            Inicia sesión en tu cuenta para continuar
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="mt-8 space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-300">
                                Email
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    mail
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input block h-12 w-full rounded-lg border border-gray-700 bg-background-dark px-10 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium text-gray-300"
                                >
                                    Contraseña
                                </label>
                                <button
                                    type="button"
                                    className="text-sm font-medium text-primary hover:text-primary/80"
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>

                            <div className="relative">
                                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    lock
                                </span>
                                <input
                                    id="password"
                                    type={mostrar ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    placeholder="Introduce tu contraseña"
                                    value={clave}
                                    onChange={(e) => setClave(e.target.value)}
                                    className="form-input block h-12 w-full rounded-lg border border-gray-700 bg-background-dark px-10 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrar((s) => !s)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-400"
                                    aria-label="Mostrar u ocultar contraseña"
                                >
                                    <span className="material-symbols-outlined">
                                        {mostrar ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-lg border border-red-400/30 bg-red-500/10 text-red-200 px-3 py-2 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={cargando}
                            className="mt-1 w-full rounded-lg bg-primary px-3 py-3 text-sm font-semibold text-black shadow-sm transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-emerald-900/40"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-transparent px-2 text-sm text-emerald-300/70">
                                O continúa con
                            </span>
                        </div>
                    </div>

                    {/* Botón Google */}
                    <button
                        type="button"
                        onClick={loginWithGoogle}
                        disabled={cargando}
                        className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-700 bg-background-dark px-3 py-2.5 text-sm font-semibold text-gray-300 shadow-sm hover:bg-gray-800/50"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <g clipPath="url(#g)">
                                <path
                                    d="M22.483 12.246c0-.812-.074-1.598-.197-2.356H12.234V14.332h5.897c-.286 1.535-1.116 2.856-2.374 3.73v2.664h3.752c1.925-1.746 2.975-4.789 2.975-8.48Z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12.234 23c2.99 0 5.479-.984 7.275-2.273l-3.752-2.664c-.984.656-2.167 1.055-3.523 1.055-2.623 0-4.855-1.805-5.684-4.234H2.672v2.75C4.468 20.91 8.055 23 12.234 23Z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M6.548 14.883a6.77 6.77 0 0 1-.328-2c0-.696.122-1.368.328-1.993V8.148H2.672A10.34 10.34 0 0 0 1.5 12.89c0 1.688.444 3.29 1.172 4.742l3.876-2.75Z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12.234 6.664c1.453 0 2.685.492 3.623 1.375l3.736-3.656C17.705 2.637 15.224 1.5 12.234 1.5c-3.178 0-5.945 1.973-7.563 5.367l3.876 2.75c.83-2.43 3.062-3.735 5.687-3.735Z"
                                    fill="#EA4335"
                                />
                            </g>
                            <defs>
                                <clipPath id="g">
                                    <rect
                                        width="21"
                                        height="21.5"
                                        transform="translate(1.5 1.25)"
                                    />
                                </clipPath>
                            </defs>
                        </svg>
                        Continuar con Google
                    </button>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-emerald-300/70">
                    ¿No tienes una cuenta?{' '}
                    <a href="#" className="font-semibold text-primary hover:text-primary/80">
                        Regístrate
                    </a>
                </p>
            </div>
        </div>
    );
}
