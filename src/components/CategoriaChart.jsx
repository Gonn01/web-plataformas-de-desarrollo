import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OTROS_COLOR = '#6b7280';

const PALETTE = [
    '#52b788',
    '#3b82f6',
    '#f59e0b',
    '#ef4444',
    '#a855f7',
    '#14b8a6',
    '#eab308',
    '#ec4899',
    '#6366f1',
    '#84cc16',
    '#06b6d4',
    '#f97316',
];

function buildChartData(gastos) {
    const totals = new Map();

    for (const g of gastos) {
        const amount = Number(g.amount || 0);
        const categories = Array.isArray(g.categories) ? g.categories : [];

        if (categories.length === 0) {
            const current = totals.get('otros') ?? { id: 'otros', name: 'Otros', value: 0 };
            current.value += amount;
            totals.set('otros', current);
            continue;
        }

        for (const cat of categories) {
            const key = String(cat.id);
            const current = totals.get(key) ?? { id: key, name: cat.name, value: 0 };
            current.value += amount;
            totals.set(key, current);
        }
    }

    let colorIndex = 0;

    return [...totals.values()]
        .filter((d) => d.value > 0)
        .map((d) => ({
            ...d,
            color: d.id === 'otros' ? OTROS_COLOR : PALETTE[colorIndex++ % PALETTE.length],
        }));
}

function formatAmount(value) {
    return new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    return (
        <div className="rounded-lg border border-white/10 bg-[#1c2620] px-3 py-2 text-sm shadow-lg">
            <p className="font-semibold mb-1" style={{ color: item.payload.color }}>
                {item.name}
            </p>
            <p className="text-slate-300">{formatAmount(item.value)}</p>
        </div>
    );
};

export default function CategoriaChart({ gastos }) {
    const data = buildChartData(gastos);

    if (data.length === 0) return null;

    return (
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-4">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                Gastos por categoría
            </p>
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                    >
                        {data.map((entry) => (
                            <Cell key={entry.id} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        formatter={(value) => (
                            <span className="text-xs text-slate-400">{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
