export default function Heading({ onCreate }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-slate-900 dark:text-white text-4xl font-black tracking-tighter">
                Mis Entidades
            </h1>

            <button
                onClick={onCreate}
                className="flex min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold tracking-wide shadow-sm hover:opacity-90 transition-opacity"
            >
                <span className="material-symbols-outlined text-lg">add</span>
                <span className="truncate">Nueva Entidad</span>
            </button>
        </div>
    );
}
