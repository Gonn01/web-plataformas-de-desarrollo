// src/services/deudas.js
const STORAGE_KEY = 'app_deudas';

// devuelve todas las deudas del localStorage
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

// guarda el arreglo completo en localStorage
export function guardarDeudas(lista) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lista ?? []));
    } catch (err) {
        console.error('Error guardando deudas en localStorage', err);
    }
}

// agrega una deuda nueva
export function agregarDeuda(deudaParcial = {}) {
    const actuales = obtenerDeudas();

    const nuevaDeuda = {
        id: deudaParcial.id ?? `d-${Date.now()}`,
        titulo: deudaParcial.titulo ?? 'Nuevo gasto / deuda',
        monto: Number.isFinite(Number(deudaParcial.monto)) ? Number(deudaParcial.monto) : 0,
        tipo: deudaParcial.tipo ?? deudaParcial.type ?? 'Debo',
        moneda: deudaParcial.moneda ?? deudaParcial.currency ?? 'ARS',
        entidad: deudaParcial.entidad ?? deudaParcial.entity ?? '',
        installments: deudaParcial.installments ?? 1,
        ...deudaParcial,
    };

    const listaActualizada = [...actuales, nuevaDeuda];
    guardarDeudas(listaActualizada);

    return nuevaDeuda;
}

// devuelve una deuda por id (o null)
export function obtenerDeudaPorId(id) {
    return obtenerDeudas().find((d) => d.id === id) ?? null;
}

// actualiza una deuda por id con los cambios que se pasen
export function actualizarDeuda(id, cambios = {}) {
    const lista = obtenerDeudas();
    const idx = lista.findIndex((d) => d.id === id);
    if (idx === -1) return null;

    const actualizada = { ...lista[idx], ...cambios };
    lista[idx] = actualizada;
    guardarDeudas(lista);

    return actualizada;
}

// elimina una deuda por id
export function eliminarDeuda(id) {
    const lista = obtenerDeudas();
    const nuevaLista = lista.filter((d) => d.id !== id);
    guardarDeudas(nuevaLista);
}
