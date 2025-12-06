import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// AUTh

export const register = async (userInfo) => {
    const { data } = await api.post('/auth/register', userInfo);
    return data.data;
};

export const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    return data.data;
};

export const loginWithFirebase = async (firebaseData) => {
    const { data } = await api.post('/auth/firebase-login', firebaseData);
    return data.data;
};

// ENTIDADES

export const createEntity = async (entityData, token) => {
    const { data } = await api.post('/entidades-financieras', entityData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
};

export const fetchFinancialEntities = async (token) => {
    const { data } = await api.get('/entidades-financieras', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
};

export const fetchFinancialEntityById = async (entityId, token) => {
    const { data } = await api.get(`/entidades-financieras/${entityId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const raw = data.data;

    return {
        id: raw.id,
        name: raw.name,
        gastos_activos: raw.gastos_activos || [],
        gastos_inactivos: raw.gastos_inactivos || [],
        logs: raw.logs || [],

        balances: [{ currency: 'ARS', amount: 0 }],
        activeExpenses: (raw.gastos_activos || []).length,
        type: 'bank',
    };
};

// Editar entidad

export const updateFinancialEntity = async (id, name, token) => {
    const { data } = await api.put(
        `/entidades-financieras/${id}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } },
    );
    return data.data;
};

// Eliminar entidad

export const deleteFinancialEntity = async (id, token) => {
    await api.delete(`/entidades-financieras/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return true;
};

// Gastos

export const createExpense = async (payload, token) => {
    const { data } = await api.post('/dashboard/gastos', payload, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return data.data;
};

export const fetchDashboardData = async (token) => {
    const { data } = await api.get('/dashboard/home', {
        headers: { Authorization: `Bearer ${token}` },
    });

    return data.data;
};
