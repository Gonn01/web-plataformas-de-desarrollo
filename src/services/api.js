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
        return data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

export const login = async (credentials) => {
    try {
        const { data } = await api.post('/auth/login', credentials);
        return data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export const loginWithFirebase = async (firebaseData) => {
    try {
        const { data } = await api.post('/auth/firebase-login', firebaseData);
        return data;
    } catch (error) {
        console.error('Error logging in with Firebase:', error);
        throw error;
    }
};

export const fetchDashboardData = async (token) => {
    try {
        console.log('Fetching dashboard data from API...', API_BASE_URL);
        const { data } = await api.get('/dashboard/home', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
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
        return data;
    } catch (error) {
        console.error('Error fetching financial entity:', error);
        throw error;
    }
};
