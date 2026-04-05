import { useMemo } from 'react';

export function useActiveExpensesFilter(groups = [], currency, query = '') {
    return useMemo(() => {
        const q = query.trim().toLowerCase();

        return groups
            .map((g) => {
                const items = g.items.filter((it) => {
                    const title = it.name.toLowerCase();
                    const matchTitle = q ? title.includes(q) : true;
                    const matchCurrency = it.currency_type === currency;

                    return matchTitle && matchCurrency;
                });

                return { ...g, items };
            })
            .filter((g) => g.items.length > 0);
    }, [groups, currency, query]);
}
