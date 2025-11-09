// src/context/use-auth.js
import { useContext } from 'react';
import { authContext } from './AuthContext';

export default function useAuth() {
    const ctx = useContext(authContext);
    if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
    return ctx;
}
