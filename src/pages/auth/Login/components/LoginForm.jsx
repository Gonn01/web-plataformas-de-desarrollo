import { useState } from 'react';
import TextInput from '../../../../components/TextInput';
import PasswordInput from '../../components/PasswordInput';
import ErrorMessage from '../../components/ErrorMessage';
import SubmitButton from '../../../../components/SubmitButton';
import { useLogin } from '../hooks/use-login';

export default function LoginForm() {
    const { loading, error, setError, handleLogin } = useLogin();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const onChange = (key, value) => {
        setForm({ ...form, [key]: value });
        if (error) setError('');
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        await handleLogin(form);
    };

    return (
        <form onSubmit={onSubmit} className="mt-8 space-y-6">
            <TextInput
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder="tu@email.com"
            />

            <PasswordInput
                value={form.password}
                onChange={(e) => onChange('password', e.target.value)}
                placeholder="Tu contraseña"
            />

            {error && <ErrorMessage message={error} />}

            <SubmitButton loading={loading}>Iniciar Sesión</SubmitButton>
        </form>
    );
}
