export function TabHeader({ tab, setTab }) {
    const tabs = ['activos', 'finalizados', 'fijos', 'log'];

    return (
        <div className="border-b border-zinc-200 dark:border-zinc-800 mb-4">
            <div className="flex gap-6">
                {tabs.map((t) => (
                    <button
                        key={t}
                        className={`pb-3 pt-2 text-sm ${tab === t
                            ? 'text-primary font-bold border-b-2 border-b-primary'
                            : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 cursor-pointer dark:hover:text-zinc-200 border-b-2 border-b-transparent'
                            }`}
                        onClick={() => setTab(t)}
                    >
                        {t === 'activos'
                            ? 'Gastos Activos'
                            : t === 'finalizados'
                                ? 'Gastos Finalizados'
                                : t === 'fijos'
                                    ? 'Gastos Fijos'
                                    : 'Log de Cambios'}
                    </button>
                ))}
            </div>
        </div>
    );
}
