// src/services/deudas.js
const STORAGE_KEY = 'app_deudas';

// Devuelve la lista de deudas guardadas en localStorage
export function obtenerDeudas() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed;
    } catch (err) {
        console.error('Error leyendo deudas de localStorage', err);
        return [];
    }
}
// Guarda la lista completa en localStorage
export function guardarDeudas(lista) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lista ?? []));
    } catch (err) {
        console.error('Error guardando deudas en localStorage', err);
    }
}

// Agrega una nueva deuda y la devuelve
export function agregarDeuda(deudaParcial = {}) {
    const actuales = obtenerDeudas();

    const nuevaDeuda = {
        id: deudaParcial.id ?? `d-${Date.now()}`,
        // Lo importante para Debo:
        titulo: deudaParcial.titulo ?? 'Nuevo gasto / deuda',
        monto: Number.isFinite(Number(deudaParcial.monto)) ? Number(deudaParcial.monto) : 0,
        ...deudaParcial,
    };

    const listaActualizada = [...actuales, nuevaDeuda];
    guardarDeudas(listaActualizada);

    return nuevaDeuda;
}
