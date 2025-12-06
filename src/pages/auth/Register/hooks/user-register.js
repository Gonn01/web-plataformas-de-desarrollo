// src/pages/auth/hooks/use-register.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '@/services/api';

export function useRegister() {
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validar = ({ name, email, password }) => {
        if (!name || name.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        if (!email.includes('@')) return 'Email inválido';
        if (!password || password.length < 6)
            return 'La contraseña debe tener al menos 6 caracteres';
        return '';
    };

    const handleRegister = async ({ name, email, password }) => {
        const msg = validar({ name, email, password });
        if (msg) {
            setError(msg);
            return false;
        }

        try {
            setLoading(true);
            setError('');
            await register({ name, email, password });
            nav('/login');
            return true;
        } catch (err) {
            setError(err.message || 'Error registrando usuario');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        setError,
        handleRegister,
    };
}
