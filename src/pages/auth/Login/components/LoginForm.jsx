import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/PasswordInput';
import ErrorMessage from '../../components/ErrorMessage';
import SubmitButton from '../../components/SubmitButton';
import TextInput from '../../components/TextInput';
import useAuth from '@/context/use-auth';

export default function LoginForm() {
    const nav = useNavigate();

    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [clave, setClave] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const validar = () => {
        if (!email.includes('@')) return 'Email inválido';
        if (clave.length < 6) return 'La contraseña debe tener 6+ caracteres';
        return '';
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const msg = validar();
        if (msg) return setError(msg);

        try {
            setCargando(true);
            setError('');
            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: clave }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error con Google');

            login(data.user);
            nav('/app/dashboard', { replace: true });
        } catch (err) {
            setError(err.message || 'Error de autenticación');
        } finally {
            setCargando(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="mt-8 space-y-6">
            {/* email */}
            <TextInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
            />

            {/* contraseña */}
            <PasswordInput
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="Introduce tu contraseña"
            />

            {error && <ErrorMessage message={error} />}

            {/* botón */}
            <SubmitButton loading={cargando}>Iniciar Sesión</SubmitButton>
        </form>
    );
}
