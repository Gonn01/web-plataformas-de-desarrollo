import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

/* ===============================
   AUTH
=============================== */

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

/* ===============================
   DASHBOARD (solo lectura)
=============================== */

export const fetchDashboardData = async (token) => {
    const { data } = await api.get('/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
};

/* ===============================
   ENTIDADES FINANCIERAS
=============================== */

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
    return data.data;
};

export const createEntity = async (entityData, token) => {
    const { data } = await api.post('/entidades-financieras', entityData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
};

export const updateFinancialEntity = async (id, name, token) => {
    const { data } = await api.put(
        `/entidades-financieras/${id}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } },
    );
    return data.data;
};

export const deleteFinancialEntity = async (id, token) => {
    await api.delete(`/entidades-financieras/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return true;
};

/* ===============================
   GASTOS
=============================== */

export const createGasto = async (payload, token) => {
    const { data } = await api.post('/gastos', payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
};

export const fetchGastoById = async (gastoId, token) => {
    const { data } = await api.get(`/gastos/${gastoId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
};

export const updateGasto = async (gastoId, payload, token) => {
    const { data } = await api.put(`/gastos/${gastoId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
};

export const deleteGasto = async (gastoId, token) => {
    await api.delete(`/gastos/${gastoId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return true;
};

export const pagarCuota = async (gastoId, token) => {
    const { data } = await api.post(
        `/gastos/${gastoId}/pagar-cuota`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
    );
    return data.data;
};

export const pagarCuotasLote = async (ids, token) => {
    const { data } = await api.post(
        `/gastos/pagar-lote`,
        { purchase_ids: ids },
        { headers: { Authorization: `Bearer ${token}` } },
    );
    return data.data;
};
