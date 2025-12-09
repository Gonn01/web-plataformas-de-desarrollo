import Icon from '@/components/Icon';

export default function EntitySelector({
    entity,
    setEntity,
    entities,
    showNewEntity,
    setShowNewEntity,
    newEntityName,
    setNewEntityName,
    handleCreateEntity,
}) {
    return (
        <div className="space-y-2">
            <label className="text-white text-sm font-medium">Entidad financiera</label>

            <div className="relative">
                <select
                    className="h-12 w-full rounded-lg border border-[#3d5245] bg-[#1c2620] px-3 text-white"
                    value={entity}
                    onChange={(e) => setEntity(e.target.value)}
                >
                    <option value="">Seleccionar...</option>

                    {entities.map((e) => (
                        <option key={`entity-${e.id}`} value={e.id}>
                            {e.name}
                        </option>
                    ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#9eb7a8]">
                    <Icon name="expand_more" />
                </div>
            </div>

            <button
                className="text-primary text-sm mt-2 hover:underline"
                onClick={() => setShowNewEntity(true)}
            >
                + Crear nueva entidad
            </button>

            {showNewEntity && (
                <div className="mt-3 p-3 border border-[#29382f] rounded-lg bg-[#1c2620] space-y-3">
                    <input
                        className="h-11 w-full rounded-lg bg-[#111714] border border-[#3d5245] text-white px-3"
                        placeholder="Nombre de la nueva entidad"
                        value={newEntityName}
                        onChange={(e) => setNewEntityName(e.target.value)}
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setShowNewEntity(false)}
                            className="text-sm px-3 py-1.5 rounded-lg bg-[#29382f] text-white"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleCreateEntity}
                            className="text-sm px-3 py-1.5 rounded-lg bg-primary text-black"
                        >
                            Crear
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
