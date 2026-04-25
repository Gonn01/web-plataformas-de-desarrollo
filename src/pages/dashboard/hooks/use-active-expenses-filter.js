import { useMemo } from 'react';

export function useActiveExpensesFilter(
    groups = [],
    currency,
    query = '',
    typeFilter = null,
    fixedFilter = null,
) {
    return useMemo(() => {
        const q = query.trim().toLowerCase();

        return groups
            .map((g) => {
                const items = g.items.filter((it) => {
                    const matchTitle = q ? it.name.toLowerCase().includes(q) : true;
                    const matchCurrency = currency === null || it.currency_type === currency;
                    const matchType = typeFilter === null || it.type === typeFilter;
                    const matchFixed = fixedFilter === null || it.fixed_expense === fixedFilter;

                    return matchTitle && matchCurrency && matchType && matchFixed;
                });

                return { ...g, items };
            })
            .filter((g) => g.items.length > 0);
    }, [groups, currency, query, typeFilter, fixedFilter]);
}
