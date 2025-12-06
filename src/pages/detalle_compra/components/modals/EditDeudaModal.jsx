import { useState } from 'react';

export default function EditDeudaModal({ gasto, onCancel, onSave }) {
    const [titulo, setTitulo] = useState(gasto.titulo);
    const [entidad, setEntidad] = useState(gasto.entidad);
    const [total, setTotal] = useState(gasto.total);
    const [moneda, setMoneda] = useState(gasto.moneda);
    const [cantCuotas, setCantCuotas] = useState(gasto.cuotas.length);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            titulo: titulo.trim(),
            entidad: entidad.trim(),
            total: Number(total) || 0,
            moneda,
            cantidadCuotas: Number(cantCuotas) || 1,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <form
                onSubmit={handleSubmit}
                className="w-[90vw] max-w-md rounded-xl bg-[#111714] p-6 space-y-4 border border-[#29382f]"
            >
                <h2 className="text-lg font-bold text-white">Editar deuda</h2>

                <label className="flex flex-col gap-1 text-sm text-white">
                    Nombre
                    <input
                        className="h-10 rounded-lg border border-[#3d5245] bg-[#1c2620] px-3 text-sm text-white"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                </label>

                <label className="flex flex-col gap-1 text-sm text-white">
                    Entidad
                    <input
                        className="h-10 rounded-lg border border-[#3d5245] bg-[#1c2620] px-3 text-sm text-white"
                        value={entidad}
                        onChange={(e) => setEntidad(e.target.value)}
                    />
                </label>

                <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1 text-sm text-white">
                        Monto total
                        <input
                            type="number"
                            min="0"
                            className="h-10 rounded-lg border border-[#3d5245] bg-[#1c2620] px-3 text-sm text-white"
                            value={total}
                            onChange={(e) => setTotal(e.target.value)}
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm text-white">
                        Moneda
                        <select
                            className="h-10 rounded-lg border border-[#3d5245] bg-[#1c2620] px-3 text-sm text-white"
                            value={moneda}
                            onChange={(e) => setMoneda(e.target.value)}
                        >
                            <option value="ARS">ARS</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </label>
                </div>

                <label className="flex flex-col gap-1 text-sm text-white">
                    Cantidad de cuotas
                    <input
                        type="number"
                        min="1"
                        className="h-10 rounded-lg border border-[#3d5245] bg-[#1c2620] px-3 text-sm text-white"
                        value={cantCuotas}
                        onChange={(e) => setCantCuotas(e.target.value)}
                    />
                </label>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="h-10 px-4 rounded-lg text-sm font-bold text-[#9eb7a8] hover:bg-[#29382f]"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="h-10 px-4 rounded-lg bg-primary text-background-dark text-sm font-bold hover:opacity-90"
                    >
                        Guardar cambios
                    </button>
                </div>
            </form>
        </div>
    );
}
