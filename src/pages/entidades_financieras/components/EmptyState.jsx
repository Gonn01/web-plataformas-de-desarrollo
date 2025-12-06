export default function EmptyState({ onCreate }) {
    return (
        <div className="flex flex-col items-center justify-center gap-6 text-center bg-white dark:bg-slate-800/50 p-8 sm:p-12 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 mt-8">
            <div className="text-primary flex items-center justify-center rounded-full bg-primary/20 shrink-0 size-16">
                <span className="material-symbols-outlined text-4xl">add_card</span>
            </div>

            <div className="flex flex-col gap-2">
                <h2 className="text-slate-900 dark:text-white text-xl font-bold">
                    Aún no tienes entidades creadas
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    Crea tu primera entidad para empezar a organizar tus finanzas.
                </p>
            </div>

            <button
                onClick={onCreate}
                className="flex min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold tracking-wide shadow-sm hover:opacity-90 transition-opacity"
            >
                <span className="material-symbols-outlined text-lg">add</span>
                <span className="truncate">Crear Primera Entidad</span>
            </button>
        </div>
    );
}
