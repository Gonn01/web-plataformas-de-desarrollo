import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ErrorMessage from '../../components/ErrorMessage';
import SubmitButton from '../../components/SubmitButton';
import TextInput from '../../components/TextInput';
import PasswordInput from '../../components/PasswordInput';
import { register } from '@/services/api';

export default function RegisterForm() {
    const nav = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [clave, setClave] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const validar = () => {
        if (name.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
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

            await register({ name, email, password: clave });

            nav('/login');
        } catch (err) {
            setError(err.message || 'Error registrando usuario');
        } finally {
            setCargando(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="mt-8 space-y-6">
            <TextInput
                label="Nombre"
                value={name}
                placeholder="Tu nombre"
                onChange={(e) => setName(e.target.value)}
            />

            <TextInput
                label="Email"
                type="email"
                value={email}
                placeholder="tu@email.com"
                onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="Crea una contraseña"
            />

            {error && <ErrorMessage message={error} />}

            <SubmitButton loading={cargando}>Registrarse</SubmitButton>
        </form>
    );
}
