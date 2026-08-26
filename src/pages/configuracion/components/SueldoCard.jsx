export function SueldoCard({ sueldo, setSueldo, loading, onSave }) {
    return (
        <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-background-dark/70">
            <h2 className="text-base font-medium mb-3 text-slate-900 dark:text-white">Sueldo</h2>

            <form className="space-y-4 text-sm" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-1">
                    <label className="text-slate-600 dark:text-slate-300" htmlFor="sueldo">
                        Sueldo mensual
                    </label>
                    <input
                        id="sueldo"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-background-dark px-3 py-2 text-sm text-slate-900 dark:text-white"
                        value={sueldo}
                        onChange={(e) => setSueldo(e.target.value)}
                    />
                </div>

                <button
                    type="button"
                    className="mt-2 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={onSave}
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : 'Guardar sueldo'}
                </button>
            </form>
        </div>
    );
}
