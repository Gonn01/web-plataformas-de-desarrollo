import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/* const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    withCredentials: true,
});

export default api; */

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

// export const fetchFinancialEntityById = async (entityId, token) => {
//     try {
//         const { data } = await api.get(`/entidades-financieras/${entityId}`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         return data.data;
//     } catch (error) {
//         console.error('Error fetching financial entity:', error);
//         throw error;
//     }
// };
export const createExpense = async (payload, token) => {
    const { data } = await api.post('/dashboard/gastos', payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data.data;
};

export const fetchFinancialEntityById = async (entityId, token) => {
    try {
        const { data } = await api.get(`/entidades-financieras/${entityId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const raw = data.data;

        // ⭐ NORMALIZACIÓN NECESARIA PARA QUE EL FRONT NO CRASHEE
        return {
            id: raw.id,
            name: raw.name,

            gastos_activos: raw.gastos_activos || [],
            gastos_inactivos: raw.gastos_inactivos || [],
            logs: raw.logs || [],

            // valores que EntityCard o StatsCard esperan
            balances: [{ currency: 'ARS', amount: 0 }],
            activeExpenses: (raw.gastos_activos || []).length,
            type: 'bank',
        };
    } catch (error) {
        console.error('Error fetching financial entity:', error);
        throw error;
    }
};
