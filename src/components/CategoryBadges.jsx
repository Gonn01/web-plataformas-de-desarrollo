export default function CategoryBadges({ categories = [] }) {
    if (!categories.length) return null;

    return (
        <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
                <span
                    key={cat.id}
                    className="px-2 py-0.5 rounded-full text-xs font-medium text-black"
                    style={{ backgroundColor: cat.color ?? '#52b788' }}
                >
                    {cat.name}
                </span>
            ))}
        </div>
    );
}
