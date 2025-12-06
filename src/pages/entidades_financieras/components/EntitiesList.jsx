import EntityCard from '@/pages/entidades_financieras/components/EntityCard';

export default function EntitiesList({ filtered, query, navigate, onDelete }) {
    return (
        <div className="flex flex-col gap-4">
            {filtered.map((e) => (
                <EntityCard
                    key={e.id}
                    entity={e}
                    onClick={() => navigate(`/app/entidades/${e.id}`)}
                    onDelete={onDelete}
                />
            ))}

            {filtered.length === 0 && (
                <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
                    No se encontraron entidades para “{query}”.
                </div>
            )}
        </div>
    );
}
