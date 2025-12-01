import { create } from 'zustand';
import { login } from '../services/api';

const getStoredAuthData = () => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    return {
        user: storedUser ? JSON.parse(storedUser) : null,
        token: storedToken || null,
    };
};

const useAuth = create((set) => ({
    ...getStoredAuthData(),
    loading: false,
    error: null,

    login: async (formData) => {
        set({ loading: true, error: null });
        try {
            const response = await login(formData);
            const id = response['id'];
            const name = response['name'];
            const email = response['email'];
            const token = response['token'];

            set({ user: { id, name, email }, token, loading: false });

            localStorage.setItem('user', JSON.stringify({ id, name, email }));
            localStorage.setItem('token', token);

            return { id, name, email };
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    logout: () => {
        set({ user: null, token: null, error: null });

        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },
}));

export default useAuth;
