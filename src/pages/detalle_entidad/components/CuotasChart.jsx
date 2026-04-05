import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

function addMonths(date, n) {
    return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

function keyFromDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function labelFromKey(key) {
    const [year, month] = key.split('-');
    return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('es-AR', {
        month: 'short',
        year: '2-digit',
    });
}

function accumulateCounts(gastos, type, counts) {
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    for (const g of gastos) {
        if (g.fixed_expense || g.type !== type) continue;

        const total = Number(g.number_of_quotas || 0);
        const paid = Number(g.payed_quotas || 0);
        const remaining = total - paid;
        if (remaining <= 0 || total === 0) continue;

        let nextMonth;
        if (g.first_quota_date) {
            const first = new Date(g.first_quota_date);
            nextMonth = addMonths(first, paid);
            if (nextMonth < currentMonth) nextMonth = currentMonth;
        } else {
            nextMonth = currentMonth;
        }

        for (let i = 0; i < remaining; i++) {
            const key = keyFromDate(addMonths(nextMonth, i));
            counts[key] = (counts[key] || 0) + 1;
        }
    }
}

function lastKeyPlusOne(counts) {
    const keys = Object.keys(counts).sort();
    if (keys.length === 0) return null;
    const last = keys.at(-1);
    const [y, m] = last.split('-');
    return keyFromDate(new Date(Number(y), Number(m), 1)); // +1 month
}

function buildChartData(gastos) {
    const egreso = {};
    const ingreso = {};

    accumulateCounts(gastos, 'EGRESO', egreso);
    accumulateCounts(gastos, 'INGRESO', ingreso);

    const egresoEnd = lastKeyPlusOne(egreso);
    const ingresoEnd = lastKeyPlusOne(ingreso);

    const allKeys = new Set([
        ...Object.keys(egreso),
        ...Object.keys(ingreso),
        ...(egresoEnd ? [egresoEnd] : []),
        ...(ingresoEnd ? [ingresoEnd] : []),
    ]);

    if (allKeys.size === 0) return [];

    return [...allKeys].sort().map((key) => {
        const hasEgreso = egresoEnd && key <= egresoEnd;
        const hasIngreso = ingresoEnd && key <= ingresoEnd;
        return {
            label: labelFromKey(key),
            egreso: hasEgreso ? (egreso[key] ?? 0) : null,
            ingreso: hasIngreso ? (ingreso[key] ?? 0) : null,
        };
    });
}

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-white/10 bg-[#1c2620] px-3 py-2 text-sm shadow-lg space-y-1">
            <p className="font-semibold text-white mb-1">{label}</p>
            {payload.map((p) => (
                <p key={p.dataKey} style={{ color: p.color }}>
                    {p.dataKey === 'egreso' ? 'Egresos' : 'Ingresos'}: {p.value} cuota{p.value !== 1 ? 's' : ''}
                </p>
            ))}
        </div>
    );
};

export default function CuotasChart({ gastos }) {
    const data = buildChartData(gastos);

    if (data.length === 0) return null;

    return (
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-4">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                Cuotas por mes
            </p>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                        dataKey="label"
                        tick={{ fill: '#9eb7a8', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        allowDecimals={false}
                        tick={{ fill: '#9eb7a8', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        formatter={(value) => (
                            <span className="text-xs text-slate-400">
                                {value === 'egreso' ? 'Egresos' : 'Ingresos'}
                            </span>
                        )}
                    />
                    <Line
                        type="monotone"
                        dataKey="egreso"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ fill: '#ef4444', r: 3 }}
                        activeDot={{ r: 5 }}
                        connectNulls={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="ingreso"
                        stroke="#52b788"
                        strokeWidth={2}
                        dot={{ fill: '#52b788', r: 3 }}
                        activeDot={{ r: 5 }}
                        connectNulls={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
