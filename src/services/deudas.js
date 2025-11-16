// src/services/deudas.js

const STORAGE_KEY = 'deudas';

// Lee todas las deudas guardadas
export function obtenerDeudas() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// Guarda la lista
export function guardarDeudas(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

// Agrega una nueva deuda y la devuelve
export function agregarDeuda(deudaParcial) {
    const actuales = obtenerDeudas();

    const nuevaDeuda = {
        id: `d-${Date.now()}`,
        ...deudaParcial,
    };

    const listaActualizada = [...actuales, nuevaDeuda];

    guardarDeudas(listaActualizada);

    return nuevaDeuda;
}
