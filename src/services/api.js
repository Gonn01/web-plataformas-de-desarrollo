import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const register = async (userInfo) => {
    try {
        const { data } = await api.post('/auth/register', userInfo);
        return data.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

export const login = async (credentials) => {
    try {
        const { data } = await api.post('/auth/login', credentials);
        return data.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export const loginWithFirebase = async (firebaseData) => {
    try {
        const { data } = await api.post('/auth/firebase-login', firebaseData);
        return data.data;
    } catch (error) {
        console.error('Error logging in with Firebase:', error);
        throw error;
    }
};

export const createEntity = async (entityData, token) => {
    try {
        const { data } = await api.post('/entidades-financieras', entityData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return data.data;
    } catch (error) {
        console.error('Error creating entity:', error);
        throw error;
    }
};

export const fetchFinancialEntities = async (token) => {
    try {
        const { data } = await api.get('/entidades-financieras', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return data.data;
    } catch (error) {
        console.error('Error fetching financial entities:', error);
        throw error;
    }
};

export const fetchDashboardData = async (token) => {
    try {
        const { data } = await api.get('/dashboard/home', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return data.data;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
};

export const fetchFinancialEntityById = async (entityId, token) => {
    try {
        const { data } = await api.get(`/entidades-financieras/${entityId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data.data;
    } catch (error) {
        console.error('Error fetching financial entity:', error);
        throw error;
    }
};
export const createExpense = async (payload, token) => {
    const { data } = await api.post('/dashboard/gastos', payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data.data;
};
