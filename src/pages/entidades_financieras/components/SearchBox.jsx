export default function SearchBox({ query, setQuery }) {
    return (
        <div className="px-0 my-6">
            <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
                    <div className="text-slate-400 dark:text-slate-500 flex bg-white dark:bg-slate-800/50 items-center justify-center pl-4 rounded-l-xl border-y border-l border-slate-200 dark:border-slate-700/80">
                        <span className="material-symbols-outlined text-2xl">search</span>
                    </div>

                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar entidad por nombre"
                        className="form-input flex w-full min-w-0 flex-1 overflow-hidden rounded-r-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-y border-r border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/50 h-full placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 text-base"
                    />
                </div>
            </label>
        </div>
    );
}
