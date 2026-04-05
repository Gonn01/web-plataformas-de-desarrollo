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
import { useExchangeRates } from '@/hooks/use-exchange-rates';
import useAuth from '@/hooks/use-auth';
import { convertCurrency } from '@/utils/convert-currency';
import { formatMoney } from '@/utils/FormatMoney';
import { Currency } from '@/utils/enums';

const CURRENCY_VALUES = Object.values(Currency);

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

function accumulateAmounts(gastos, type, amounts, preferredCurrency, rates) {
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    for (const g of gastos) {
        if (g.fixed_expense || g.type !== type) continue;

        const total = Number(g.number_of_quotas || 0);
        const paid = Number(g.payed_quotas || 0);
        const remaining = total - paid;
        if (remaining <= 0 || total === 0) continue;

        const amountPerQuota = Number(g.amount_per_quota || 0);
        const converted = convertCurrency(
            amountPerQuota,
            g.currency_type,
            preferredCurrency,
            rates,
        );
        if (converted === null) continue;

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
            amounts[key] = (amounts[key] || 0) + converted;
        }
    }
}

function lastKeyPlusOne(counts) {
    const keys = Object.keys(counts).sort();
    if (keys.length === 0) return null;
    const last = keys.at(-1);
    const [y, m] = last.split('-');
    return keyFromDate(new Date(Number(y), Number(m), 1));
}

function buildChartData(gastos, preferredCurrency, rates) {
    const egreso = {};
    const ingreso = {};

    accumulateAmounts(gastos, 'EGRESO', egreso, preferredCurrency, rates);
    accumulateAmounts(gastos, 'INGRESO', ingreso, preferredCurrency, rates);

    const egresoEnd = lastKeyPlusOne(egreso);
    const ingresoEnd = lastKeyPlusOne(ingreso);

    const allKeys = new Set([
        ...Object.keys(egreso),
        ...Object.keys(ingreso),
        ...(egresoEnd ? [egresoEnd] : []),
        ...(ingresoEnd ? [ingresoEnd] : []),
    ]);

    if (allKeys.size === 0) return [];

    return [...allKeys].sort().map((key) => ({
        label: labelFromKey(key),
        egreso: egresoEnd && key <= egresoEnd ? (egreso[key] ?? 0) : null,
        ingreso: ingresoEnd && key <= ingresoEnd ? (ingreso[key] ?? 0) : null,
    }));
}

function formatAxis(value) {
    if (value === 0) return '0';
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
    return value.toFixed(0);
}

const CustomTooltip = ({ active, payload, label, currency }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-white/10 bg-[#1c2620] px-3 py-2 text-sm shadow-lg space-y-1">
            <p className="font-semibold text-white mb-1">{label}</p>
            {payload.map((p) => (
                <p key={p.dataKey} style={{ color: p.color }}>
                    {p.dataKey === 'egreso' ? 'Egresos' : 'Ingresos'}:{' '}
                    {formatMoney(p.value, currency)}
                </p>
            ))}
        </div>
    );
};

export default function MontoChart({ gastos }) {
    const { rates } = useExchangeRates();
    const { user } = useAuth();

    const pref = user?.preferred_currency ?? user?.monedaPreferida;
    const preferredCurrency = CURRENCY_VALUES.includes(pref) ? pref : Currency.ARS;

    const data = buildChartData(gastos, preferredCurrency, rates);

    if (data.length === 0) return null;

    return (
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-4">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                Monto por mes{' '}
                <span className="font-normal text-slate-500">({preferredCurrency})</span>
            </p>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
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
                        tickFormatter={(v) => formatAxis(v, preferredCurrency)}
                    />
                    <Tooltip content={<CustomTooltip currency={preferredCurrency} />} />
                    <Legend
                        formatter={(value) => (
                            <span className="text-xs text-slate-400">
                                {value === 'egreso' ? 'Egresos' : 'Ingresos'}{' '}
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
