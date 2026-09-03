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

export const updatePreferredCurrency = async (userId, preferredCurrency, token) => {
    const { data } = await api.put(
        '/auth/preferred-currency',
        { user_id: userId, preferred_currency: preferredCurrency },
        { headers: { Authorization: `Bearer ${token}` } },
    );
    return data.data[0];
};

/* ===============================
   USUARIO
=============================== */

export const updateSueldo = async (sueldo, sueldoCurrency, token) => {
    const { data } = await api.put(
        '/user/sueldo',
        { sueldo, sueldo_currency: sueldoCurrency },
        { headers: { Authorization: `Bearer ${token}` } },
    );
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

export const vincularUsuarioEntidad = async (entityId, email, token) => {
    const { data } = await api.put(
        `/entidades-financieras/${entityId}/vincular-usuario`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } },
    );
    return data.data;
};

export const desvincularUsuarioEntidad = async (entityId, token) => {
    const { data } = await api.delete(`/entidades-financieras/${entityId}/vincular-usuario`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
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

export const deleteGasto = async (gastoId, token, { deleteLinked = false } = {}) => {
    await api.delete(`/gastos/${gastoId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { delete_linked: deleteLinked },
    });
    return true;
};

export const refundCuota = async (gastoId, token) => {
    const { data } = await api.post(
        `/gastos/${gastoId}/refund-cuota`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
    );
    return data.data;
};

export const pagarCuota = async (gastoId, token) => {
    const { data } = await api.post(
        `/gastos/${gastoId}/pagar-cuota`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
    );
    return data.data;
};

export const postergarGasto = async (gastoId, postponed, token) => {
    const { data } = await api.put(
        `/gastos/${gastoId}/postergar`,
        { postponed },
        { headers: { Authorization: `Bearer ${token}` } },
    );
    return data.data;
};

export const favoritoGasto = async (gastoId, favorite, token) => {
    const { data } = await api.put(
        `/gastos/${gastoId}/favorito`,
        { favorite },
        { headers: { Authorization: `Bearer ${token}` } },
    );
    return data.data;
};

export const favoritoEntidad = async (entidadId, favorite, token) => {
    const { data } = await api.put(
        `/entidades-financieras/${entidadId}/favorito`,
        { favorite },
        { headers: { Authorization: `Bearer ${token}` } },
    );
    return data.data;
};

/* ===============================
   CATEGORIAS
=============================== */

export const fetchCategories = async (token) => {
    const { data } = await api.get('/categorias', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
};

export const createCategory = async (payload, token) => {
    const { data } = await api.post('/categorias', payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
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

/* ===============================
   MODO HACER CUENTAS (reconcile)
=============================== */

export const fetchReconcileSession = async (token) => {
    const { data } = await api.get('/reconcile/session', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data; // { session, items } | null
};

export const startReconcileSession = async (token) => {
    const { data } = await api.post(
        '/reconcile/session',
        {},
        { headers: { Authorization: `Bearer ${token}` } },
    );
    return data.data; // { session, items, alreadyOpen }
};

export const setReconcileItem = async ({ purchase_id, purchase_ids, checked, auto }, token) => {
    const body = purchase_ids ? { purchase_ids, checked } : { purchase_id, checked, auto };
    const { data } = await api.put('/reconcile/session/items', body, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data; // { session, items }
};

export const finishReconcileSession = async (token) => {
    const { data } = await api.post(
        '/reconcile/session/finish',
        {},
        { headers: { Authorization: `Bearer ${token}` } },
    );
    return data.data; // snapshot
};

export const discardReconcileSession = async (token) => {
    const { data } = await api.delete('/reconcile/session', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
};

export const fetchReconcileSnapshots = async (token) => {
    const { data } = await api.get('/reconcile/snapshots', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
};

export const fetchReconcileSnapshotById = async (id, token) => {
    const { data } = await api.get(`/reconcile/snapshots/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
};

/* ===============================
   COMPARTIDOS
=============================== */

export const fetchCompartidos = async (token) => {
    const { data } = await api.get('/compartidos', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data; // { recibidos, emitidos, pagos: { porConfirmar, esperando } }
};

export const aprobarCompartido = async (gastoId, payload, token) => {
    const { data } = await api.post(`/compartidos/${gastoId}/aprobar`, payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
};

export const rechazarCompartido = async (gastoId, token) => {
    const { data } = await api.post(
        `/compartidos/${gastoId}/rechazar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
    );
    return data.data;
};

export const reintentarCompartido = async (gastoId, token) => {
    const { data } = await api.post(
        `/compartidos/${gastoId}/reintentar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
    );
    return data.data;
};

/* ===============================
   PAGOS COMPARTIDOS (confirmación entre usuarios)
   La lectura viaja dentro de fetchCompartidos() -> data.pagos
=============================== */

export const confirmarPago = async (movementId, token) => {
    const { data } = await api.post(
        `/compartidos/pagos/${movementId}/confirmar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
    );
    return data.data;
};

export const rechazarPago = async (movementId, token) => {
    const { data } = await api.post(
        `/compartidos/pagos/${movementId}/rechazar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
    );
    return data.data;
};
