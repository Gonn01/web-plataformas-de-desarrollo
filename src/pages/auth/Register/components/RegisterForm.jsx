import { useState } from 'react';
import TextInput from '../../../../components/TextInput';
import PasswordInput from '../../components/PasswordInput';
import ErrorMessage from '../../components/ErrorMessage';
import SubmitButton from '../../../../components/SubmitButton';
import { useRegister } from '../hooks/user-register';

export default function RegisterForm() {
    const { loading, error, setError, handleRegister } = useRegister();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });

    const onChange = (key, value) => {
        setForm({ ...form, [key]: value });
        if (error) setError('');
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        await handleRegister(form);
    };

    return (
        <form onSubmit={onSubmit} className="mt-8 space-y-6">
            <TextInput
                label="Nombre"
                value={form.name}
                onChange={(e) => onChange('name', e.target.value)}
                placeholder="Tu nombre"
            />

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
                placeholder="Crea una contraseña"
            />

            {error && <ErrorMessage message={error} />}
            <SubmitButton loading={loading}>Registrarse</SubmitButton>
        </form>
    );
}
