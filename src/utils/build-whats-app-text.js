import { convertCurrency } from '@/utils/convert-currency';
import { formatAmount } from '@/utils/FormatMoney';

function purchaseText(it, displayCur, rates) {
    const original = Number(it.amount_per_quota ?? 0);
    const originalPart = `${original.toFixed(1)} ${it.currency_type}`;
    let amount;
    if (!displayCur || it.currency_type === displayCur) {
        amount = originalPart;
    } else {
        const converted = convertCurrency(original, it.currency_type, displayCur, rates);
        amount = `${originalPart} (${(converted ?? 0).toFixed(1)} ${displayCur})`;
    }
    const cuota = it.fixed_expense
        ? it.type === 'INGRESO'
            ? 'Ingreso fijo'
            : 'Gasto fijo'
        : `Cuota ${it.payed_quotas}/${it.number_of_quotas}`;
    return `${it.name}: ${amount}\n${cuota}\n\n`;
}

export function buildWhatsAppText(group, selectedCurrency, preferredCurrency, rates) {
    const buf = [];
    buf.push(`${group.name}: \n`);

    if (selectedCurrency) {
        const items = group.items.filter((i) => i.currency_type === selectedCurrency);
        const egresos = items.filter((i) => i.type !== 'INGRESO');
        const ingresos = items.filter((i) => i.type === 'INGRESO');
        const totalDebtor = egresos.reduce((s, it) => s + Number(it.amount_per_quota ?? 0), 0);
        const totalCreditor = ingresos.reduce((s, it) => s + Number(it.amount_per_quota ?? 0), 0);

        if (egresos.length > 0) {
            buf.push(`\n*Te debo (${selectedCurrency}):*\n\n`);
            for (const it of egresos) buf.push(purchaseText(it, selectedCurrency, null));
            buf.push(`*En total te debo:* ${formatAmount(totalDebtor)} ${selectedCurrency}\n\n\n`);
        }
        if (ingresos.length > 0) {
            buf.push(`*Me debés (${selectedCurrency}):*\n\n`);
            for (const it of ingresos) buf.push(purchaseText(it, selectedCurrency, null));
            buf.push(
                `*En total me debés:* ${formatAmount(totalCreditor)} ${selectedCurrency}\n\n\n`,
            );
        }

        const balance = totalDebtor - totalCreditor;
        const label = balance < 0 ? '*Resumen*: Me debés en total:' : 'Te debo en total:';
        buf.push(`${label} ${formatAmount(Math.abs(balance))} ${selectedCurrency}`);
        if (totalDebtor > 0 && totalCreditor > 0) {
            buf.push(
                ` (${formatAmount(Math.max(totalDebtor, totalCreditor))} - ${formatAmount(Math.min(totalDebtor, totalCreditor))})`,
            );
        }
        return buf.join('');
    }

    const cur = preferredCurrency ?? 'ARS';
    const egresos = group.items.filter((i) => i.type !== 'INGRESO');
    const ingresos = group.items.filter((i) => i.type === 'INGRESO');

    const totalDebtor = egresos.reduce(
        (s, it) =>
            s +
            (convertCurrency(Number(it.amount_per_quota ?? 0), it.currency_type, cur, rates) ?? 0),
        0,
    );
    const totalCreditor = ingresos.reduce(
        (s, it) =>
            s +
            (convertCurrency(Number(it.amount_per_quota ?? 0), it.currency_type, cur, rates) ?? 0),
        0,
    );

    if (egresos.length > 0) {
        buf.push(`\n*Te debo (${cur}):*\n\n`);
        for (const it of egresos) buf.push(purchaseText(it, cur, rates));
        buf.push(`*En total te debo:* ${formatAmount(totalDebtor)} ${cur}\n\n\n`);
    }
    if (ingresos.length > 0) {
        buf.push(`*Me debés (${cur}):*\n\n`);
        for (const it of ingresos) buf.push(purchaseText(it, cur, rates));
        buf.push(`*En total me debés:* ${formatAmount(totalCreditor)} ${cur}\n\n\n`);
    }

    const hasUSD = group.items.some((i) => i.currency_type === 'USD');
    const hasEUR = group.items.some((i) => i.currency_type === 'EUR');
    if (hasUSD && rates?.USD) buf.push(`Valor del dólar tomado: 1 USD = ${rates.USD} ARS\n\n\n`);
    if (hasEUR && rates?.EUR) buf.push(`Valor del euro tomado: 1 EUR = ${rates.EUR} ARS\n\n\n`);

    const balance = totalDebtor - totalCreditor;
    const label = balance < 0 ? '*Resumen*: Me debés en total:' : 'Te debo en total:';
    buf.push(`${label} ${formatAmount(Math.abs(balance))} ${cur}`);
    if (totalDebtor > 0 && totalCreditor > 0) {
        buf.push(
            ` (${formatAmount(Math.max(totalDebtor, totalCreditor))} - ${formatAmount(Math.min(totalDebtor, totalCreditor))})`,
        );
    }

    return buf.join('');
}
