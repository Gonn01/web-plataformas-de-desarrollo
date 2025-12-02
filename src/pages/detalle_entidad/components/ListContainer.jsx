export function ListContainer({ empty, emptyLabel, children }) {
    return (
        <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
            {empty ? (
                <div className="text-sm text-zinc-500 dark:text-zinc-400 py-6">{emptyLabel}</div>
            ) : (
                children
            )}
        </div>
    );
}
