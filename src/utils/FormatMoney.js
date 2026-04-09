export function formatAmount(n) {
    return Number(n ?? 0).toFixed(2);
}

export function formatMoney(amount, currency) {
    const f = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    });
    const sign = amount < 0 ? '-' : '';
    return `${sign}${f.format(Math.abs(amount))}`;
}
